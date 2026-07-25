import { AttributeEditor } from "@/components/AttributeEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/store/useCategoryStore";
import { CheckIcon, NotePencilIcon } from "@phosphor-icons/react";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared";
import type { UpdateUserProfileAttributePayload } from "@rh/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type FC } from "react";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAutoSave } from "../../hooks/use-auto-save";
import { bulkUpdateProfileAttributes, type BulkUpdateUserAttributeArgs, type UserAttributeWithJoins } from "../users/profile/api";
import type { ResumeAttributeItem, ResumeDetail } from "./api";
import { styles } from "./data";
import { Badge } from "@/components/ui/badge";
import { ResumeStatus } from "@rh/database/browser";

interface UserAttributeUpdateArgs {
  id: string;
  version: number;
  payload: UpdateUserProfileAttributePayload;
}
interface ProfileFormData {
  attrs: Record<
    string,
    {
      attr: UserAttributeWithJoins;
      value: any;
    }
  >;
}

interface ResumeSectionProps {
  title: string;
  items: [
    string,
    {
      attr: UserAttributeWithJoins;
      value: any;
    },
  ][];
  form: UseFormReturn<ProfileFormData>;
  flush: () => Promise<void>;
  queueUpdate: (args: UserAttributeUpdateArgs) => void;
}
const ResumeSection: FC<ResumeSectionProps> = ({ title, items, form, queueUpdate, flush }) => {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{title}</h2>
      <dl className="resume-attribute-list">
        {items.map(([userAttrId, { attr }]) => (
          <div key={userAttrId} className="resume-attribute-row">
            <dt className="resume-attribute-name">{attr.attribute.name}</dt>
            <dd className="resume-attribute-value max-w-100">
              <Controller
                control={form.control}
                name={`attrs.${attr.id}.value`}
                render={({ field }) => {
                  return (
                    <AttributeEditor
                      type={attr.attribute.type}
                      value={field.value}
                      onValueChange={(value) => {
                        const version = form.getValues(`attrs.${attr.id}.attr.version`);
                        if (value !== form.getValues(`attrs.${attr.id}.value`)) {
                          queueUpdate({
                            id: attr.id,
                            version,
                            payload: getDynamicValueObject(value, attr.attribute.type),
                          });
                          field.onChange(value);
                        }
                      }}
                      onBlur={() => {
                        flush();
                        field.onBlur();
                      }}
                      choices={(attr.attribute as any).choices ?? []}
                    />
                  );
                }}
              />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export const ResumeForm = ({ resume, onDoneEditing }: { resume: ResumeDetail; onDoneEditing: VoidFunction }) => {
  const categories = useCategoryStore((store) => store.categories);

  const [conflicts, setConflicts] = useState<Record<string, boolean>>({});

  const form = useForm<ProfileFormData>({
    defaultValues: {
      attrs: {},
    },
  });

  const groupedByCategory = resume.resumeAttributes.reduce(
    (acc, ra) => {
      const categoryId = ra.positionAttribute.attribute.categoryId;
      if (!acc[categoryId]) acc[categoryId] = [];
      acc[categoryId].push(ra);
      return acc;
    },
    {} as Record<string, ResumeAttributeItem[]>,
  );

  const sortedCategories = categories.filter((cat) => groupedByCategory[cat.id]).sort((a, b) => a.sortOrder - b.sortOrder);

  const updateProfileAttributeMutation = useMutation({
    mutationFn: ({ data }: Omit<BulkUpdateUserAttributeArgs, "userId">) =>
      bulkUpdateProfileAttributes({
        userId: resume.userId,
        data,
      }),
  });

  const handleSave = useCallback(async (values: UserAttributeUpdateArgs[]) => {
    updateProfileAttributeMutation
      .mutateAsync({
        data: values.map((value) => ({
          data: value.payload,
          version: value.version,
          id: value.id,
        })),
      })
      .then((res) => {
        const { concurrent_modification = [], modified } = res?.data ?? {};

        if (concurrent_modification.length) {
          setConflicts(
            concurrent_modification.reduce(
              (result, item) => {
                result[item.id] = true;
                return result;
              },
              {} as typeof conflicts,
            ),
          );
        }

        modified.forEach((item) => {
          if (form.getValues(`attrs.${item.id}.attr.version`) < item.version) {
            form.setValue(`attrs.${item.id}.attr.version`, item.version);
          }
        });
      });
  }, []);

  const { resumeAttributes } = resume;
  useEffect(() => {
    if (Array.isArray(resumeAttributes)) {
      form.reset({
        attrs: resumeAttributes.reduce(
          (result, item) => {
            const value =
              readDynamicValue(item.userAttribute.attribute.type, item.userAttribute) ?? getDynamicDefaultValue(item.userAttribute.attribute.type);
            result[item.userAttribute.id] = {
              value,
              attr: item.userAttribute,
            };
            return result;
          },
          {} as ProfileFormData["attrs"],
        ),
      });
    } else {
      form.reset({
        attrs: {},
      });
    }
  }, [resumeAttributes]);

  const { queueUpdate, flush } = useAutoSave<UserAttributeUpdateArgs>(handleSave);

  const readCategoryAttributes = (categoryId: string) => {
    const attrs = form.watch("attrs");
    return Object.entries(attrs).filter(([, item]) => item.attr.attribute.categoryId === categoryId);
  };

  return (
    <>
      <div className="resume-page">
        <header className="resume-header">
          <div className="resume-header-info">
            <Avatar className="resume-avatar">
              <AvatarImage src={resume.user.avatar ?? undefined} alt={resume.user.name ?? "Avatar"} />
              <AvatarFallback>{(resume.user.name ?? "U").charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="resume-name">{resume.user.name ?? "Unnamed"}</h1>
                {resume.status === ResumeStatus.DRAFT ? (
                  <Badge variant="warning">
                    <NotePencilIcon /> Draft
                  </Badge>
                ) : null}
              </div>
              <p className="resume-email">{resume.user.email}</p>
            </div>
          </div>
          <div className="resume-position">
            <p className="resume-position-label">Applying for</p>
            <Link to={`/positions/${resume.position.id}`} className="resume-position-title">
              {resume.position.title}
            </Link>
            <div className="no-print mt-5">
              <Button variant="link" onClick={onDoneEditing}>
                <CheckIcon />
                Done
              </Button>
            </div>
          </div>
        </header>

        <div className="resume-body">
          {sortedCategories.map((category) => {
            const items = readCategoryAttributes(category.id);
            if (!items || items.length === 0) return null;
            return <ResumeSection key={category.id} title={category.name} items={items} form={form} flush={flush} queueUpdate={queueUpdate} />;
          })}
        </div>
      </div>
      <style>{styles}</style>
    </>
  );
};
