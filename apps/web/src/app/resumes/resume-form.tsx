import { AttributeEditor } from "@/components/attribute-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/store/use-category-store";
import { CheckIcon, NotePencilIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared";
import type { BulkUpdateUserProfileAttributePayload, UpdateUserProfileAttributePayload } from "@rh/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAutoSave } from "../../hooks/use-auto-save";
import { bulkUpdateProfileAttributes, type BulkUpdateUserAttributeArgs, type UserAttributeWithJoins } from "../users/profile/api";
import type { ResumeAttributeItem, ResumeDetail } from "./api";
import { styles } from "./styles";
import { Badge } from "@/components/ui/badge";
import { ResumeStatus } from "@rh/database/browser";
import { AttributeConflictResolve } from "@/components/attribute/attribute-conflict-resolve";

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
  userId: string;
  title: string;
  items: [
    string,
    {
      attr: UserAttributeWithJoins;
      value: any;
    },
  ][];
  form: UseFormReturn<ProfileFormData>;

  conflicts: Record<string, BulkUpdateUserProfileAttributePayload[number]>;
  errors: Record<string, string>;

  flush(): Promise<void>;
  queueUpdate(args: UserAttributeUpdateArgs): void;
  onChangeConflicts: Dispatch<SetStateAction<Record<string, BulkUpdateUserProfileAttributePayload[number]>>>;
  onSave(data: UserAttributeUpdateArgs[]): Promise<void>;
}
const ResumeSection: FC<ResumeSectionProps> = ({ userId, title, items, form, conflicts, errors, onChangeConflicts, onSave, queueUpdate, flush }) => {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{title}</h2>
      <dl className="resume-attribute-list">
        {items.map(([userAttrId, { attr }]) => (
          <div key={userAttrId} className="resume-attribute-row">
            <dt className="resume-attribute-name">{attr.attribute.name}</dt>
            <dd className="resume-attribute-value">
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
                      flush={() => {
                        flush();
                        field.onBlur();
                      }}
                      choices={(attr.attribute as any).choices ?? []}
                    />
                  );
                }}
              />
            </dd>
            <div className="resume-attribute-meta">
              {errors[attr.id] ? (
                <Badge variant="destructive">
                  <WarningCircleIcon />
                  {errors[attr.id]}
                </Badge>
              ) : null}
              {conflicts[attr.id] ? (
                <AttributeConflictResolve
                  userId={userId}
                  userAttributeId={attr.id}
                  conflict={conflicts[attr.id]}
                  form={form}
                  onSave={onSave}
                  onResolve={() =>
                    onChangeConflicts((prev) => {
                      const newValues = { ...prev };
                      delete newValues[attr.id];
                      return newValues;
                    })
                  }
                />
              ) : null}
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
};

export const ResumeForm = ({ resume, onDoneEditing }: { resume: ResumeDetail; onDoneEditing: VoidFunction }) => {
  const categories = useCategoryStore((store) => store.categories);

  const [saving, setSaving] = useState(false);
  const [conflicts, setConflicts] = useState<Record<string, BulkUpdateUserProfileAttributePayload[number]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const form = useForm<ProfileFormData>({
    defaultValues: {
      attrs: {},
    },
  });

  const groupedByCategory = resume.attributes.reduce(
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
    const res = await updateProfileAttributeMutation.mutateAsync({
      data: values.map((value) => ({
        data: value.payload,
        version: value.version,
        id: value.id,
      })),
    });

    const { concurrent_modification = [], modified, failed_unknown } = res?.data ?? {};

    if (concurrent_modification.length) {
      setConflicts((prevValues) => {
        const newValues = { ...prevValues };

        modified.forEach((modified) => {
          if (newValues[modified.id]) {
            delete newValues[modified.id];
          }
        });

        failed_unknown.forEach((fail) => {
          if (newValues[fail.id]) {
            delete newValues[fail.id];
          }
        });

        concurrent_modification.forEach((failModif) => {
          newValues[failModif.id] = failModif;
        });

        return newValues;
      });
    }

    if (failed_unknown.length) {
      setErrors((prevValues) => {
        const newValues = { ...prevValues };

        failed_unknown.forEach((fail) => {
          newValues[fail.id] = "Unknown error";
        });

        return newValues;
      });
    }

    modified.forEach((item) => {
      if (form.getValues(`attrs.${item.id}.attr.version`) < item.version) {
        form.setValue(`attrs.${item.id}.attr.version`, item.version);
      }
    });
  }, []);
  const { queueUpdate, flush } = useAutoSave<UserAttributeUpdateArgs>(handleSave);

  const { attributes } = resume;
  useEffect(() => {
    if (Array.isArray(attributes)) {
      form.reset({
        attrs: attributes.reduce(
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
  }, [attributes]);

  const readCategoryAttributes = (categoryId: string) => {
    const attrs = form.watch("attrs");
    return Object.entries(attrs).filter(([, item]) => item.attr.attribute.categoryId === categoryId);
  };

  const handleDoneEditing = () => {
    setSaving(true);
    flush()
      .then(() => {
        onDoneEditing();
      })
      .finally(() => {
        setSaving(false);
      });
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
              <Button variant="link" loading={saving} onClick={handleDoneEditing}>
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
            return (
              <ResumeSection
                key={category.id}
                title={category.name}
                items={items}
                form={form}
                flush={flush}
                queueUpdate={queueUpdate}
                conflicts={conflicts}
                errors={errors}
                onSave={handleSave}
                onChangeConflicts={setConflicts}
                userId={resume.userId}
              />
            );
          })}
        </div>
      </div>
      <style>{styles}</style>
    </>
  );
};
