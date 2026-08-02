import { PositionService } from '@/position/position.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  Attribute,
  AttributeChoice,
  AttributeType,
  UserAttribute,
} from '@rh/database/client';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

type UserAttributeWithChoice = UserAttribute & {
  choice: AttributeChoice | null;
};

@Injectable()
export class IntegrationService {
  constructor(
    private readonly positionService: PositionService,
    private readonly prisma: PrismaService,
  ) {}

  async getAggregatePositionData(positionId: string) {
    const position = await this.positionService.findOne({ id: positionId });

    const data: PositionAggrData = {
      id: position.id,
      title: position.title,
      attributes: [],
    };

    const users = await this.prisma.user.findMany({
      where: {
        resumes: {
          some: {
            positionId: position.id,
          },
        },
      },
    });

    const attributes = position.attributes
      .map((pa) => pa.attribute)
      .filter((attr) => attr.type !== AttributeType.IMAGE);

    const userAttributes = await this.prisma.userAttribute.findMany({
      where: {
        attributeId: {
          in: attributes.map((attr) => attr.id),
        },
        userId: {
          in: users.map((user) => user.id),
        },
      },
      include: {
        choice: true,
      },
    });

    for (const attribute of attributes) {
      const values = userAttributes.filter(
        (ua) => ua.attributeId === attribute.id,
      );
      data.attributes.push(this.aggregate(attribute, values));
    }

    return data;
  }

  private aggregate(
    attribute: Attribute,
    values: UserAttributeWithChoice[],
  ): PositionAggrData['attributes'][number] {
    switch (attribute.type) {
      case AttributeType.NUMERIC:
        return this.aggregateNumeric(attribute, values);
      case AttributeType.CHOICE:
        return this.aggregateChoice(attribute, values);
      case AttributeType.BOOLEAN:
        return this.aggregateBoolean(attribute, values);
      case AttributeType.DATE:
        return this.aggregateDate(attribute, values);
      case AttributeType.DATEPERIOD:
        return this.aggregateDatePeriod(attribute, values);
      case AttributeType.TEXT:
        return this.aggregateText(attribute, values);
      case AttributeType.MARKDOWN:
        return this.aggregateMarkdown(attribute, values);
      default:
        throw new Error(`Unsupported attribute type: ${attribute.type}`);
    }
  }

  private aggregateNumeric(
    attribute: Attribute,
    values: UserAttributeWithChoice[],
  ): NumericAggrData {
    const numbers = values
      .map((ua) => ua.numberValue)
      .filter((v): v is number => v !== null && v !== undefined);
    const min = numbers.length ? numbers.reduce((a, b) => Math.min(a, b)) : 0;
    const max = numbers.length ? numbers.reduce((a, b) => Math.max(a, b)) : 0;
    const avg = numbers.length
      ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length
      : 0;
    return {
      id: attribute.id,
      title: attribute.name,
      type: AttributeType.NUMERIC,
      stats: { min, max, avg, count: numbers.length },
    };
  }

  private aggregateChoice(
    attribute: Attribute,
    values: UserAttributeWithChoice[],
  ): ChoiceAggrData {
    const distribution: Record<string, number> = {};
    for (const ua of values) {
      const key = ua.choice?.value ?? '(empty)';
      distribution[key] = (distribution[key] ?? 0) + 1;
    }
    const top_values = Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .map(([value]) => value);
    return {
      id: attribute.id,
      title: attribute.name,
      type: AttributeType.CHOICE,
      stats: { top_values, distribution, count: values.length },
    };
  }

  private aggregateBoolean(
    attribute: Attribute,
    values: UserAttributeWithChoice[],
  ): BooleanAggrData {
    const true_count = values.filter((ua) => ua.booleanValue === true).length;
    const false_count = values.filter((ua) => ua.booleanValue === false).length;
    const count = values.length;
    const true_percentage = count ? Math.round((true_count / count) * 100) : 0;
    return {
      id: attribute.id,
      title: attribute.name,
      type: AttributeType.BOOLEAN,
      stats: { true_count, false_count, true_percentage, count },
    };
  }

  private aggregateDate(
    attribute: Attribute,
    values: UserAttributeWithChoice[],
  ): DateAggrData {
    const dates = values
      .map((ua) => ua.dateValue)
      .filter((v): v is Date => v !== null && v !== undefined);
    const earliest = dates.length
      ? new Date(
          dates.reduce((a, b) => (a.getTime() < b.getTime() ? a : b)),
        ).toISOString()
      : '';
    const latest = dates.length
      ? new Date(
          dates.reduce((a, b) => (a.getTime() > b.getTime() ? a : b)),
        ).toISOString()
      : '';
    return {
      id: attribute.id,
      title: attribute.name,
      type: AttributeType.DATE,
      stats: { earliest, latest, count: dates.length },
    };
  }

  private aggregateDatePeriod(
    attribute: Attribute,
    values: UserAttributeWithChoice[],
  ): DatePeriodAggrData {
    const periods = values.filter(
      (ua) =>
        ua.startDateValue !== null &&
        ua.startDateValue !== undefined &&
        ua.endDateValue !== null &&
        ua.endDateValue !== undefined,
    );
    const earliestStart = periods.length
      ? new Date(
          periods.reduce((a, b) =>
            a.startDateValue!.getTime() < b.startDateValue!.getTime() ? a : b,
          ).startDateValue!,
        ).toISOString()
      : '';
    const latestEnd = periods.length
      ? new Date(
          periods.reduce((a, b) =>
            a.endDateValue!.getTime() > b.endDateValue!.getTime() ? a : b,
          ).endDateValue!,
        ).toISOString()
      : '';
    const avgDurationDays = periods.length
      ? periods.reduce(
          (sum, p) =>
            sum +
            (p.endDateValue!.getTime() - p.startDateValue!.getTime()) /
              MS_PER_DAY,
          0,
        ) / periods.length
      : 0;
    return {
      id: attribute.id,
      title: attribute.name,
      type: AttributeType.DATEPERIOD,
      stats: {
        earliest_start: earliestStart,
        latest_end: latestEnd,
        avg_duration_days: avgDurationDays,
        count: periods.length,
      },
    };
  }

  private aggregateText(
    attribute: Attribute,
    values: UserAttributeWithChoice[],
  ): TextAggrData {
    const texts = values
      .map((ua) => ua.textValue)
      .filter((v): v is string => v !== null && v !== undefined);
    const counts = new Map<string, number>();
    for (const text of texts) {
      counts.set(text, (counts.get(text) ?? 0) + 1);
    }
    const top_values = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([value]) => value);
    return {
      id: attribute.id,
      title: attribute.name,
      type: AttributeType.TEXT,
      stats: { top_values, unique_count: counts.size, count: texts.length },
    };
  }

  private aggregateMarkdown(
    attribute: Attribute,
    values: UserAttributeWithChoice[],
  ): MarkdownAggrData {
    const texts = values
      .map((ua) => ua.textValue)
      .filter((v): v is string => v !== null && v !== undefined);
    const avgWordCount = texts.length
      ? texts.reduce(
          (sum, text) => sum + text.trim().split(/\s+/).filter(Boolean).length,
          0,
        ) / texts.length
      : 0;
    return {
      id: attribute.id,
      title: attribute.name,
      type: AttributeType.MARKDOWN,
      stats: { total_entries: texts.length, avg_word_count: avgWordCount },
    };
  }
}

type PositionAggrData = {
  id: string;
  title: string;
  attributes: (
    | NumericAggrData
    | ChoiceAggrData
    | BooleanAggrData
    | DateAggrData
    | DatePeriodAggrData
    | TextAggrData
    | MarkdownAggrData
  )[];
};

type NumericAggrData = {
  id: string;
  title: string;
  type: 'NUMERIC';
  stats: {
    min: number;
    max: number;
    avg: number;
    count: number;
  };
};

type ChoiceAggrData = {
  id: string;
  title: string;
  type: 'CHOICE';
  stats: {
    top_values: string[];
    distribution: Record<string, number>;
    count: number;
  };
};

type BooleanAggrData = {
  id: string;
  title: string;
  type: 'BOOLEAN';
  stats: {
    true_count: number;
    false_count: number;
    true_percentage: number;
    count: number;
  };
};

type DateAggrData = {
  id: string;
  title: string;
  type: 'DATE';
  stats: {
    earliest: string;
    latest: string;
    count: number;
  };
};

type DatePeriodAggrData = {
  id: string;
  title: string;
  type: 'DATEPERIOD';
  stats: {
    earliest_start: string;
    latest_end: string;
    avg_duration_days: number;
    count: number;
  };
};

type TextAggrData = {
  id: string;
  title: string;
  type: 'TEXT';
  stats: {
    top_values: string[];
    unique_count: number;
    count: number;
  };
};

type MarkdownAggrData = {
  id: string;
  title: string;
  type: 'MARKDOWN';
  stats: {
    total_entries: number;
    avg_word_count: number;
  };
};
