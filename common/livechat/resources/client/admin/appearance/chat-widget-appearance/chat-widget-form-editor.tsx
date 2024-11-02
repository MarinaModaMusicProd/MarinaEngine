import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {Link} from 'react-router-dom';
import {Trans} from '@ui/i18n/trans';
import {message} from '@ui/i18n/message';
import {SegmentIcon} from '@ui/icons/material/Segment';
import {Button} from '@ui/buttons/button';
import {AddIcon} from '@ui/icons/material/Add';
import {useFieldArray} from 'react-hook-form';
import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {Item} from '@ui/forms/listbox/item';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {CheckCircleIcon} from '@ui/icons/material/CheckCircle';
import React, {ComponentType, Fragment, useRef, useState} from 'react';
import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {EmailIcon} from '@ui/icons/material/Email';
import {TextFieldsIcon} from '@ui/icons/material/TextFields';
import {ArrowDropDownIcon} from '@ui/icons/material/ArrowDropDown';
import {CheckBoxIcon} from '@ui/icons/material/CheckBox';
import {DeleteIcon} from '@ui/icons/material/Delete';
import {DragIndicatorIcon} from '@ui/icons/material/DragIndicator';
import {useSortable} from '@ui/interactions/dnd/sortable/use-sortable';
import {ButtonBase} from '@ui/buttons/button-base';
import {AnimatePresence, m} from 'framer-motion';
import {AccordionAnimation} from '@ui/accordion/accordtion-animation';
import {DragPreviewRenderer} from '@ui/interactions/dnd/use-draggable';
import {DragPreview} from '@ui/interactions/dnd/drag-preview';
import {ChatWidgetAppearanceFormValue} from '@livechat/admin/appearance/chat-widget-appearance/chat-widget-appearance-form';
import {FormCheckbox} from '@ui/forms/toggle/checkbox';
import {WidgetFormElementConfig} from '@livechat/widget/widget-config';
import {useTrans, UseTransReturn} from '@ui/i18n/use-trans';
import {MessageDescriptor} from '@ui/i18n/message-descriptor';
import {nanoid} from 'nanoid';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {FormSelect} from '@ui/forms/select/select';
import {useHelpdeskGroupsAutocomplete} from '@helpdesk/groups/requests/use-helpdesk-groups-autocomplete';
import {Avatar} from '@ui/avatar/avatar';

interface FormBuilderElementConfig {
  name: WidgetFormElementConfig['name'];
  label: MessageDescriptor;
  icon: ComponentType;
  optionsConfig?: {
    labelPlaceholder?: string;
    valuePlaceholder?: string;
    valueList?: string;
  };
  getDefaultValue: (opts: {
    trans: UseTransReturn['trans'];
  }) => Record<string, unknown>;
}

const elements: FormBuilderElementConfig[] = [
  {
    name: 'information',
    label: message('Information'),
    icon: SegmentIcon,
    getDefaultValue: () => ({
      message: 'Hello! Please fill in the form below before starting the chat.',
    }),
  },
  {
    name: 'name',
    label: message('Name'),
    icon: TextFieldsIcon,
    getDefaultValue: () => ({
      label: 'Name',
    }),
  },
  {
    name: 'email',
    label: message('Email'),
    icon: EmailIcon,
    getDefaultValue: () => ({
      label: 'Email',
    }),
  },
  {
    name: 'input',
    label: message('Question'),
    icon: TextFieldsIcon,
    getDefaultValue: () => ({
      label: 'Question',
    }),
  },
  {
    name: 'radio',
    label: message('Choice list'),
    icon: CheckCircleIcon,
    getDefaultValue: ({trans}) => ({
      label: 'Choose one',
      options: [
        {label: trans({message: 'Answer 1'}), id: nanoid(10)},
        {label: trans({message: 'Answer 2'}), id: nanoid(10)},
      ],
    }),
  },
  {
    name: 'dropdown',
    label: message('Dropdown'),
    icon: ArrowDropDownIcon,
    getDefaultValue: ({trans}) => ({
      label: 'Choose one',
      options: [
        {label: trans({message: 'Answer 1'}), id: nanoid(10)},
        {label: trans({message: 'Answer 2'}), id: nanoid(10)},
      ],
    }),
  },
  {
    name: 'checkboxes',
    label: message('Multiple choices'),
    icon: CheckBoxIcon,
    getDefaultValue: ({trans}) => ({
      label: 'Choose one or more',
      options: [
        {label: trans({message: 'Answer 1'}), id: nanoid(10)},
        {label: trans({message: 'Answer 2'}), id: nanoid(10)},
      ],
    }),
  },
  {
    name: 'group',
    label: message('Department'),
    icon: ArrowDropDownIcon,
    optionsConfig: {
      labelPlaceholder: 'Department name',
      valuePlaceholder: 'Select a group',
      valueList: 'groups',
    },
    getDefaultValue: ({trans}) => ({
      label: 'Choose a department',
      options: [{id: nanoid(10)}, {id: nanoid(10)}],
    }),
  },
];

const uniqueElements = ['email', 'name'];
const formKey = 'settings.chatWidget.forms.preChat.elements' as const;

export function ChatWidgetFormEditorList() {
  return (
    <div>
      <AppearanceButton to="pre-chat" elementType={Link}>
        <Trans message="Pre-chat" />
      </AppearanceButton>
      <AppearanceButton to="post-chat" elementType={Link}>
        <Trans message="Post-chat" />
      </AppearanceButton>
    </div>
  );
}

export function PreChatFormEditor() {
  const {trans} = useTrans();
  const {fields, append, remove, move} = useFieldArray<
    ChatWidgetAppearanceFormValue,
    typeof formKey,
    'key'
  >({
    name: formKey,
    keyName: 'key',
  });

  const [expandedItems, setExpandedItems] = useState<number[]>(
    // open first 3 elements by default
    [...fields.keys()].splice(0, 3),
  );

  const addNewElement = (element: FormBuilderElementConfig) => {
    const newValue: Partial<WidgetFormElementConfig> = {
      name: element.name,
      id: nanoid(10),
      ...element.getDefaultValue({trans}),
    };
    append(newValue as Required<WidgetFormElementConfig>);
    setExpandedItems([...expandedItems, fields.length]);
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        <div className="mb-24 space-y-12">
          {fields.map((field, index) => (
            <ElementAccordionItem
              key={field.key}
              field={field}
              fields={fields}
              index={index}
              isExpanded={expandedItems.includes(index)}
              onToggle={() => {
                setExpandedItems(
                  expandedItems.includes(index)
                    ? expandedItems.filter(i => i !== index)
                    : [...expandedItems, index],
                );
              }}
              onRemove={() => remove(index)}
              onSortEnd={(oldIndex, newIndex) => {
                move(oldIndex, newIndex);
              }}
            />
          ))}
        </div>
      </AnimatePresence>
      <div className="flex items-center justify-between gap-8">
        <MenuTrigger>
          <Button variant="outline" startIcon={<AddIcon />} size="xs">
            <Trans message="Add element" />
          </Button>
          <Menu>
            {elements.map(element => {
              const Icon = element.icon;
              return (
                <Item
                  startIcon={<Icon />}
                  key={element.name}
                  value={element.name}
                  onSelected={() => addNewElement(element)}
                  isDisabled={
                    uniqueElements.includes(element.name) &&
                    fields.some(f => f.name === element.name)
                  }
                >
                  {<Trans {...element.label} />}
                </Item>
              );
            })}
          </Menu>
        </MenuTrigger>
        <FormSwitch name={`settings.chatWidget.forms.preChat.disabled`}>
          <Trans message="Disabled" />
        </FormSwitch>
      </div>
    </div>
  );
}

interface ElementAccordionItemProps {
  field: {name: WidgetFormElementConfig['name']};
  fields: {name: WidgetFormElementConfig['name']}[];
  index: number;
  onRemove: () => void;
  onSortEnd: (oldIndex: number, newIndex: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
}
function ElementAccordionItem({
  field,
  fields,
  index,
  onRemove,
  onSortEnd,
  isExpanded,
  onToggle,
}: ElementAccordionItemProps) {
  const config = elements.find(e => e.name === field.name)!;
  const domRef = useRef<HTMLTableRowElement>(null);
  const previewRef = useRef<DragPreviewRenderer>(null);
  const {sortableProps, dragHandleRef} = useSortable({
    ref: domRef,
    preview: previewRef,
    item: field,
    items: fields,
    type: 'chatWidgetFormsSort',
    onSortEnd,
  });

  return (
    <Fragment>
      <div className="rounded-panel border" ref={domRef} {...sortableProps}>
        <div className="flex items-center p-4">
          <IconButton size="sm" ref={dragHandleRef}>
            <DragIndicatorIcon />
          </IconButton>
          <ButtonBase
            className="h-36 flex-auto items-center rounded-button pl-8 hover:bg-hover"
            justify="items-start"
            onClick={() => onToggle()}
          >
            <Trans {...config.label} />
            <ArrowDropDownIcon />
          </ButtonBase>
          {fields.length > 1 && (
            <IconButton
              size="sm"
              onClick={() => onRemove()}
              className="ml-auto"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>
        <m.div
          variants={AccordionAnimation.variants}
          transition={AccordionAnimation.transition}
          initial={false}
          animate={isExpanded ? 'open' : 'closed'}
        >
          <div className="border-t p-14">
            <ElementForm name={field.name} index={index} />
            {field.name !== 'information' && (
              <div className="mt-14 flex justify-end">
                <FormCheckbox size="sm" name={`${formKey}.${index}.required`}>
                  <Trans message="Required" />
                </FormCheckbox>
              </div>
            )}
          </div>
        </m.div>
      </div>
      <DragPreview ref={previewRef}>
        {() => (
          <div className="rounded bg-chip p-6 text-sm shadow">{field.name}</div>
        )}
      </DragPreview>
    </Fragment>
  );
}

interface ElementFormProps {
  name: string;
  index: number;
}
function ElementForm({name, index}: ElementFormProps) {
  switch (name) {
    case 'information':
    case 'name':
    case 'email':
    case 'input':
      return (
        <FormTextField
          size="sm"
          label={
            name === 'information' ? (
              <Trans message="Message" />
            ) : (
              <Trans message="Label" />
            )
          }
          name={
            name === 'information'
              ? `${formKey}.${index}.message`
              : `${formKey}.${index}.label`
          }
          inputElementType={name === 'information' ? 'textarea' : undefined}
          rows={3}
          required
        />
      );
    case 'radio':
    case 'checkboxes':
    case 'dropdown':
    case 'group':
      return <ChoiceListForm elementName={name} elementIndex={index} />;
  }
}

interface ChoiceListFormProps {
  elementIndex: number;
  elementName: string;
}
function ChoiceListForm({elementIndex, elementName}: ChoiceListFormProps) {
  const elementConfig = elements.find(e => e.name === elementName)!;
  const {fields, append, remove} = useFieldArray<
    ChatWidgetAppearanceFormValue,
    any,
    'key'
  >({
    name: `${formKey}.${elementIndex}.options`,
    keyName: 'key',
  });

  return (
    <Fragment>
      <FormTextField
        size="sm"
        label={<Trans message="Label" />}
        name={`${formKey}.${elementIndex}.label`}
        required
      />
      <div className="ml-14 mt-14">
        {fields.map((field, index) => (
          <Fragment key={field.key}>
            <FormTextField
              name={`${formKey}.${elementIndex}.options.${index}.label`}
              className="mb-14"
              size="xs"
              placeholder={elementConfig.optionsConfig?.labelPlaceholder}
              required
              labelSuffix={
                index !== 0 ? (
                  <IconButton
                    onClick={() => remove(index)}
                    size="2xs"
                    iconSize="xs"
                  >
                    <CloseIcon />
                  </IconButton>
                ) : null
              }
              label={
                <Trans message="Choice #:number" values={{number: index + 1}} />
              }
            />
            {elementConfig.optionsConfig?.valueList && (
              <ChoiceListValueSelect
                placeholder={elementConfig.optionsConfig.valuePlaceholder}
                elementIndex={elementIndex}
                optionIndex={index}
                valueListName={elementConfig.optionsConfig.valueList}
              />
            )}
          </Fragment>
        ))}
        <Button
          className="mt-10"
          variant="outline"
          startIcon={<AddIcon />}
          size="xs"
          onClick={() => append(`Answer ${fields.length + 1}`)}
        >
          <Trans message="Add choice" />
        </Button>
      </div>
    </Fragment>
  );
}

interface ChoiceListValueSelectProps {
  placeholder?: string;
  elementIndex: number;
  valueListName: string;
  optionIndex: number;
}
function ChoiceListValueSelect({
  placeholder,
  valueListName,
  elementIndex,
  optionIndex,
}: ChoiceListValueSelectProps) {
  const query = useHelpdeskGroupsAutocomplete();
  return (
    <FormSelect
      name={`${formKey}.${elementIndex}.options.${optionIndex}.value`}
      selectionMode="single"
      className="mb-14"
      size="xs"
      required
      placeholder={placeholder}
    >
      {query.data?.groups.map(group => (
        <Item
          key={group.id}
          value={`${group.id}`}
          startIcon={<Avatar label={group.name} size="xs" />}
          capitalizeFirst
        >
          {group.name}
        </Item>
      ))}
    </FormSelect>
  );
}
