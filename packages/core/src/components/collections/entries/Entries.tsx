import React, { useMemo } from 'react';
import { translate } from 'react-polyglot';

import Loader from '@staticcms/core/components/common/progress/Loader';
import entriesClasses from './Entries.classes';
import EntryListing from './EntryListing';

import type { ViewStyle } from '@staticcms/core/constants/views';
import type { Collection, Collections, Entry, TranslatedProps } from '@staticcms/core/interface';
import type Cursor from '@staticcms/core/lib/util/Cursor';

import './Entries.css';

export interface BaseEntriesProps {
  entries: Entry[];
  page?: number;
  isFetching: boolean;
  viewStyle: ViewStyle;
  cursor: Cursor;
  filterTerm: string;
  handleCursorActions?: (action: string) => void;
}

export interface SingleCollectionEntriesProps extends BaseEntriesProps {
  collection: Collection;
}

export interface MultipleCollectionEntriesProps extends BaseEntriesProps {
  collections: Collections;
}

export type EntriesProps = SingleCollectionEntriesProps | MultipleCollectionEntriesProps;

const Entries = ({
  entries,
  isFetching,
  viewStyle,
  cursor,
  filterTerm,
  handleCursorActions,
  t,
  page,
  ...otherProps
}: TranslatedProps<EntriesProps>) => {
  const loadingMessages = useMemo(
    () => [
      t('collection.entries.loadingEntries'),
      t('collection.entries.cachingEntries'),
      t('collection.entries.longerLoading'),
    ],
    [t],
  );

  if (isFetching && page === undefined) {
    return <Loader>{loadingMessages}</Loader>;
  }

  const hasEntries = (entries && entries.length > 0) || cursor?.actions?.has('append_next');
  if (hasEntries) {
    return 'collection' in otherProps ? (
      <EntryListing
        key="collection-listing"
        collection={otherProps.collection}
        entries={entries}
        viewStyle={viewStyle}
        cursor={cursor}
        handleCursorActions={handleCursorActions}
        page={page}
        isLoadingEntries={isFetching && page !== undefined && entries.length > 0}
        filterTerm={filterTerm}
      />
    ) : (
      <EntryListing
        key="search-listing"
        collections={otherProps.collections}
        entries={entries}
        viewStyle={viewStyle}
        cursor={cursor}
        handleCursorActions={handleCursorActions}
        page={page}
        isLoadingEntries={isFetching && page !== undefined && entries.length > 0}
        filterTerm={filterTerm}
      />
    );
  }

  return <div className={entriesClasses.root}>{t('collection.entries.noEntries')}</div>;
};

export default translate()(Entries);
