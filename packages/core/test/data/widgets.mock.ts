/* eslint-disable import/prefer-default-export */
import { createMockCollection } from './collections.mock';
import { createMockConfig } from './config.mock';
import { createMockEntry } from './entry.mock';

import type { BaseField, UnknownField, WidgetControlProps } from '@staticcms/core';

jest.mock('@staticcms/core/backend');

export const createMockWidgetControlProps = <T, F extends BaseField = UnknownField>(
  options: Omit<
    Partial<WidgetControlProps<T, F>>,
    | 'field'
    | 'data'
    | 'hasErrors'
    | 'onChange'
    | 'openMediaLibrary'
    | 'removeInsertedMedia'
    | 'query'
    | 't'
  > &
    Pick<WidgetControlProps<T, F>, 'field'>,
): WidgetControlProps<T, F> => {
  const {
    value: rawValue,
    path: rawPath,
    errors: rawErrors,
    fieldsErrors: rawFieldsErrors,
    collection: rawCollection,
    config: rawConfig,
    entry: rawEntry,
    ...extra
  } = options;

  const value = rawValue ?? null;

  const collection = rawCollection ?? createMockCollection({}, options.field);
  const config = rawConfig ?? createMockConfig({ collections: [collection] });
  const entry = rawEntry ?? createMockEntry({ data: { [options.field.name]: value } });

  const path = rawPath ?? '';
  const errors = rawErrors ?? [];
  const fieldsErrors =
    rawFieldsErrors ?? (rawErrors ? { [`${path}.${options.field.name}`]: errors } : {});
  const hasErrors = Boolean(rawErrors && rawErrors.length > 0);

  return {
    label: 'Mock Widget',
    config,
    collection,
    collectionFile: undefined,
    entry,
    value,
    path,
    fieldsErrors,
    errors,
    hasErrors,
    submitted: false,
    forList: false,
    listItemPath: undefined,
    forSingleList: false,
    disabled: false,
    locale: undefined,
    i18n: undefined,
    duplicate: false,
    controlled: false,
    theme: 'light',
    onChange: jest.fn(),
    clearChildValidation: jest.fn(),
    query: jest.fn(),
    t: jest.fn(),
    ...extra,
  };
};
