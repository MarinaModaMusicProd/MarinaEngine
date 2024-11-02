import {slugifyString} from '@ui/utils/string/slugify-string';
import {getBootstrapData} from '@ui/bootstrap-data/bootstrap-data-store';

export function getRadioLink(
  seed: {model_type: string; id: number; name: string},
  {absolute}: {absolute?: boolean} = {},
): string {
  let link = `/radio/${seed.model_type}/${seed.id}/${slugifyString(seed.name)}`;
  if (absolute) {
    link = `${getBootstrapData().settings.base_url}${link}`;
  }
  return link;
}
