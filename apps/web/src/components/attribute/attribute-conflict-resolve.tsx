import { fetchUserAttributeById, type UserAttributeWithJoins } from "@/app/users/profile/api";
import { Button } from "@/components/ui/button";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { renderDynamicValue } from "@/utils/renderDynamicValue";
import { ArrowsClockwiseIcon, CloudArrowDownIcon, CloudArrowUpIcon, GitDiffIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { AttributeType } from "@rh/database/browser";
import { readDynamicValue, type BulkUpdateUserProfileAttributePayload, type UpdateUserProfileAttributePayload } from "@rh/shared";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useState, type FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";

export enum ResolveAction {
  KeepMine = "KeepMine",
  AcceptRemote = "AcceptRemote",
  Compare = "Compare",
}

export interface UserAttributeConflictsState extends Record<string, BulkUpdateUserProfileAttributePayload[number]> {}

export interface UserAttributeUpdateArgs {
  id: string;
  version: number;
  payload: UpdateUserProfileAttributePayload;
}
export interface UserAttributesFormData {
  attrs: Record<
    string,
    {
      attr: UserAttributeWithJoins;
      value: any;
    }
  >;
}

export const AttributeConflictResolve: FC<{
  form: UseFormReturn<UserAttributesFormData>;
  userId: string;
  userAttributeId: string;
  conflict: UserAttributeConflictsState[string];

  onSave(values: UserAttributeUpdateArgs[]): Promise<void>;
  onResolve(): void;
}> = ({ form, userId, userAttributeId, conflict, onSave, onResolve }) => {
  const [loading, setLoading] = useState<ResolveAction>();

  const [diff, setDiff] = useState<{
    type: AttributeType;
    remote: UserAttributeWithJoins;
    local: UserAttributeWithJoins;
  }>();

  const fetchUserAttributeByIdMutation = useMutation({
    mutationFn: (id: string) => fetchUserAttributeById(userId, id),
  });

  const handleResolveConflict = async (attrId: string, action: ResolveAction) => {
    try {
      setLoading(action);

      const res = await fetchUserAttributeByIdMutation.mutateAsync(attrId);
      const remoteData = res.data;

      if (!remoteData) {
        throw new Error("Failed to resolve remote record");
      }

      switch (action) {
        case ResolveAction.KeepMine: {
          const localData = conflict;
          await onSave([
            {
              id: localData.id,
              version: remoteData.version,
              payload: localData.data,
            },
          ]);
          onResolve();
          break;
        }
        case ResolveAction.AcceptRemote: {
          form.setValue(`attrs.${attrId}`, {
            attr: remoteData,
            value: readDynamicValue(remoteData.attribute.type, remoteData),
          });
          onResolve();
          break;
        }
        case ResolveAction.Compare: {
          setDiff({
            type: remoteData.attribute.type,
            remote: remoteData,
            local: {
              ...conflict.data,
              attributeId: remoteData.attributeId,
              attribute: remoteData.attribute,
              choice: remoteData.attribute.choices.find((ch) => ch.id === conflict.data.choiceId) ?? null,
              createdAt: remoteData.createdAt,
              id: remoteData.id,
              userId: remoteData.userId,
              version: conflict.version,
            } as any,
          });
          break;
        }
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error)?.message ?? "Could not resolve conflicts");
    } finally {
      setLoading(undefined);
    }
  };

  return (
    <>
      <Popover modal>
        <PopoverTrigger render={<Button size="sm" variant="destructive-outline" />}>
          <WarningCircleIcon weight="bold" /> Conflict
        </PopoverTrigger>
        <PopoverPopup side="right">
          <div className="flex flex-col gap-1">
            <Button
              loading={loading === ResolveAction.KeepMine}
              size="sm"
              variant="secondary"
              onClick={() => handleResolveConflict(userAttributeId, ResolveAction.KeepMine)}
            >
              <CheckIcon size={14} /> Keep Mine
            </Button>
            <Button
              loading={loading === ResolveAction.AcceptRemote}
              size="sm"
              variant="secondary"
              onClick={() => handleResolveConflict(userAttributeId, ResolveAction.AcceptRemote)}
            >
              <ArrowsClockwiseIcon size={14} /> Accept Remote
            </Button>
            <Popover
              open={Boolean(diff)}
              onOpenChange={(open) => {
                if (!open) {
                  setDiff(undefined);
                }
              }}
            >
              <PopoverTrigger
                render={
                  <Button
                    loading={loading === ResolveAction.Compare}
                    size="sm"
                    variant="secondary"
                    disabled={Boolean(diff)}
                    onClick={() => handleResolveConflict(userAttributeId, ResolveAction.Compare)}
                  >
                    <GitDiffIcon size={14} /> Compare
                  </Button>
                }
              ></PopoverTrigger>
              <PopoverPopup side="left" sideOffset={20}>
                {diff && (
                  <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
                    <div className="bg-info/10 border-info rounded-md p-2">
                      <span className="flex items-center gap-1 text-sm font-bold text-info">
                        <CloudArrowDownIcon weight="bold" className="size-4" />
                        Remote
                      </span>
                      <p className="text-sm mt-2">{renderDynamicValue(diff.type, diff.remote)}</p>
                    </div>
                    <div className="bg-success/10 border-sucbg-success rounded-md p-2">
                      <span className="flex items-center gap-1 text-sm font-bold text-success">
                        <CloudArrowUpIcon weight="bold" className="size-4" />
                        Local
                      </span>
                      <p className="text-sm mt-2">{renderDynamicValue(diff.type, diff.local)}</p>
                    </div>
                  </div>
                )}
              </PopoverPopup>
            </Popover>
          </div>
        </PopoverPopup>
      </Popover>
    </>
  );
};
