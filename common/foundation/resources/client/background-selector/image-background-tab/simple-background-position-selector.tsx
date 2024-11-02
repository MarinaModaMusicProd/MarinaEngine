import {RadioGroup} from '@ui/forms/radio-group/radio-group';
import {Radio} from '@ui/forms/radio-group/radio';
import {Trans} from '@ui/i18n/trans';
import {MessageDescriptor} from '@ui/i18n/message-descriptor';
import {message} from '@ui/i18n/message';
import {BackgroundSelectorConfig} from '@common/background-selector/background-selector-config';

const BackgroundPositions: Record<
  'cover' | 'contain' | 'repeat',
  {
    label: MessageDescriptor;
    bgConfig: Partial<BackgroundSelectorConfig>;
    compactLabel?: MessageDescriptor;
  }
> = {
  cover: {
    label: message('Stretch to fit'),
    bgConfig: {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
  },
  contain: {
    label: message('Fit image'),
    compactLabel: message('Fit'),
    bgConfig: {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center top',
    },
  },
  repeat: {
    label: message('Repeat image'),
    compactLabel: message('Repeat'),
    bgConfig: {
      backgroundRepeat: 'repeat',
      backgroundSize: undefined,
      backgroundPosition: 'left top',
    },
  },
};

interface Props<T extends {backgroundSize?: string}> {
  compactLabels?: boolean;
  disabled?: boolean;
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
}
export function SimpleBackgroundPositionSelector<
  T extends {backgroundSize?: string},
>({
  value: imageBgValue,
  onChange,
  className,
  compactLabels,
  disabled,
}: Props<T>) {
  const selectedPosition = positionKeyFromValue(imageBgValue);
  return (
    <div className={className}>
      <RadioGroup size="sm" disabled={!imageBgValue}>
        {Object.entries(BackgroundPositions).map(([key, position]) => (
          <Radio
            key={key}
            disabled={disabled}
            name="background-position"
            value={key}
            checked={key === selectedPosition}
            onChange={e => {
              if (imageBgValue) {
                onChange?.({
                  ...imageBgValue,
                  ...position.bgConfig,
                });
              }
            }}
          >
            {compactLabels ? (
              <Trans {...(position.compactLabel ?? position.label)} />
            ) : (
              <Trans {...position.label} />
            )}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}

function positionKeyFromValue(
  value?: Props<any>['value'],
): keyof typeof BackgroundPositions {
  if (value?.backgroundSize === 'cover') {
    return 'cover';
  } else if (value?.backgroundSize === 'contain') {
    return 'contain';
  } else {
    return 'repeat';
  }
}
