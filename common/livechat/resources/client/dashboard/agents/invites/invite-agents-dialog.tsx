import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {Trans} from '@ui/i18n/trans';
import {isEmail} from '@ui/utils/string/is-email';
import {useTrans} from '@ui/i18n/use-trans';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {Button} from '@ui/buttons/button';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';
import {Avatar} from '@ui/avatar/avatar';
import {useSendAgentInvites} from '@livechat/dashboard/agents/invites/requests/use-send-agent-invites';
import {Skeleton} from '@ui/skeleton/skeleton';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {useForm} from 'react-hook-form';
import {Form} from '@ui/forms/form';
import {FormChipField} from '@ui/forms/input-field/chip-field/form-chip-field';
import {ReactNode, useEffect} from 'react';
import {useRoleGroupAutocomplete} from '@livechat/dashboard/agents/invites/requests/use-role-group-autocomplete';
import {Role} from '@common/auth/role';
import {Group} from '@helpdesk/groups/group';
import {useNavigate} from '@common/ui/navigation/use-navigate';

interface FormValues {
  emails: string[];
  role_id: number | string;
  group_id: number | string;
}

export function InviteAgentsDialog() {
  const {trans} = useTrans();
  const {close, formId} = useDialogContext();
  const query = useRoleGroupAutocomplete();
  const sendInvites = useSendAgentInvites();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: {
      emails: [],
    },
  });

  useEffect(() => {
    if (query.data && !form.getValues('role_id')) {
      form.reset({
        emails: [],
        role_id: query.data.defaultRoleId,
        group_id: query.data.defaultGroupId,
      });
    }
  }, [query.data, form]);

  return (
    <Dialog size="lg">
      <DialogHeader>
        <Trans message="Invite agents" />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={values =>
            sendInvites.mutate(values, {
              onSuccess: () => {
                close();
                navigate('/dashboard/invited-agents');
              },
            })
          }
        >
          <FormChipField
            label={<Trans message="Emails" />}
            name="emails"
            valueKey="name"
            validateWith={chip => {
              const invalid = !isEmail(chip.name);
              return {
                ...chip,
                invalid,
                errorMessage: invalid
                  ? trans({message: 'Not a valid email'})
                  : undefined,
              };
            }}
            placeholder={trans({
              message: 'Type or paste address and press enter',
            })}
          />
          <AnimatePresence initial={false} mode="wait">
            {query.data ? (
              <RoleAndGroupSelects
                roles={query.data.roles}
                groups={query.data.groups}
              />
            ) : (
              <RoleAndGroupSkeleton />
            )}
          </AnimatePresence>
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          variant="flat"
          color="primary"
          type="submit"
          form={formId}
          disabled={!form.watch('emails').length || sendInvites.isPending}
        >
          <Trans message="Send invites" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

interface RoleAndGroupSelectsProps {
  roles: Role[];
  groups: Group[];
}
function RoleAndGroupSelects({roles, groups}: RoleAndGroupSelectsProps) {
  return (
    <SelectsContainer animationKey="real-selects">
      <FormSelect
        name="role_id"
        selectionMode="single"
        label={<Trans message="Role" />}
        size="sm"
        className="flex-auto"
      >
        {roles.map(role => (
          <Item
            key={role.id}
            value={role.id}
            startIcon={<Avatar label={role.name} size="sm" />}
            capitalizeFirst
          >
            <Trans message={role.name} />
          </Item>
        ))}
      </FormSelect>
      <FormSelect
        name="group_id"
        selectionMode="single"
        label={<Trans message="Group" />}
        size="sm"
        className="flex-auto"
      >
        {groups.map(group => (
          <Item
            key={group.id}
            value={group.id}
            startIcon={<Avatar label={group.name} size="sm" />}
            capitalizeFirst
          >
            <Trans message={group.name} />
          </Item>
        ))}
      </FormSelect>
    </SelectsContainer>
  );
}

interface SelectsContainerProps {
  children: ReactNode;
  animationKey: string;
}
function SelectsContainer({children, animationKey}: SelectsContainerProps) {
  return (
    <m.div
      key={animationKey}
      {...opacityAnimation}
      className="mt-16 flex items-center gap-12"
    >
      {children}
    </m.div>
  );
}

function RoleAndGroupSkeleton() {
  return (
    <SelectsContainer animationKey="select-skeletons">
      <SelectSkeleton key="skeleton-one" />
      <SelectSkeleton key="skeleton-two" />
    </SelectsContainer>
  );
}

function SelectSkeleton() {
  return (
    <div className="flex-auto">
      <Skeleton className="mb-4 max-w-40" />
      <Skeleton variant="rect" size="h-36 w-full" />
    </div>
  );
}
