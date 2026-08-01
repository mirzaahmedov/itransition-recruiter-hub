import { PositionService } from '@/position/position.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AttributeType } from '@rh/database/client';

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

    const numericAttributes = position.attributes.filter(
      (attr) => attr.attribute.type === AttributeType.NUMERIC,
    );

    console.log({ numericAttributes });

    for (let attr of numericAttributes) {
      const aggr = await this.prisma.userAttribute.aggregate({
        _min: {
          numberValue: true,
        },
        _max: {
          numberValue: true,
        },
        _avg: {
          numberValue: true,
        },
        _count: {
          numberValue: true,
        },
        where: {
          attributeId: attr.attributeId,
          userId: {
            in: users.map((user) => user.id),
          },
        },
      });
      data.attributes.push({
        id: attr.attribute.id,
        type: attr.attribute.type,
        title: attr.attribute.name,
        stats: {
          min: aggr._min.numberValue ?? 0,
          avg: aggr._avg.numberValue ?? 0,
          max: aggr._max.numberValue ?? 0,
          count: aggr._count.numberValue ?? 0,
        },
      } as NumericAggrData);
    }

    return data;
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
    distribution: {
      React: number;
      NestJS: number;
      Vue: number;
    };
    count: number;
  };
};

type BooleanAggrData = {
  id: string;
  title: string;
  type: string;
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
  type: string;
  stats: {
    earliest: string;
    latest: string;
    count: number;
  };
};

type DatePeriodAggrData = {
  id: string;
  title: string;
  type: string;
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
  type: string;
  stats: {
    top_values: string[];
    unique_count: number;
    count: number;
  };
};

type MarkdownAggrData = {
  id: string;
  title: string;
  type: string;
  stats: {
    total_entries: number;
    avg_word_count: number;
  };
};
