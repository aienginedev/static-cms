import GeoJSON from 'ol/format/GeoJSON';
import Draw from 'ol/interaction/Draw';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map.js';
import OSMSource from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View.js';
import React, { useLayoutEffect, useRef } from 'react';

import Field from '@staticcms/core/components/common/field/Field';
import classNames from '@staticcms/core/lib/util/classNames.util';
import { generateClassNames } from '@staticcms/core/lib/util/theming.util';

import type { MapField, WidgetControlProps } from '@staticcms/core/interface';
import type { Geometry } from 'ol/geom';
import type { FC } from 'react';

import './MapControl.css';

const classes = generateClassNames('WidgetMap', [
  'root',
  'error',
  'required',
  'disabled',
  'for-single-list',
  'map',
]);

const formatOptions = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
};

function getDefaultFormat() {
  return new GeoJSON(formatOptions);
}

function getDefaultMap(target: HTMLDivElement, featuresLayer: VectorLayer<VectorSource<Geometry>>) {
  return new Map({
    target,
    layers: [new TileLayer({ source: new OSMSource() }), featuresLayer],
    view: new View({ center: [0, 0], zoom: 2 }),
  });
}

interface WithMapControlProps {
  getFormat?: (field: MapField) => GeoJSON;
  getMap?: (target: HTMLDivElement, featuresLayer: VectorLayer<VectorSource<Geometry>>) => Map;
}

const withMapControl = ({ getFormat, getMap }: WithMapControlProps = {}) => {
  const MapControl: FC<WidgetControlProps<string, MapField>> = ({
    value,
    field,
    onChange,
    errors,
    hasErrors,
    forSingleList,
    label,
    disabled,
  }) => {
    const { height = '400px' } = field;

    const mapContainer = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      const format = getFormat ? getFormat(field) : getDefaultFormat();
      const features = value ? [format.readFeature(value)] : [];

      const featuresSource = new VectorSource({ features, wrapX: false });
      const featuresLayer = new VectorLayer({ source: featuresSource });

      const target = mapContainer.current;
      if (!target) {
        return;
      }

      const map = getMap ? getMap(target, featuresLayer) : getDefaultMap(target, featuresLayer);
      if (features.length > 0) {
        map.getView().fit(featuresSource.getExtent(), { maxZoom: 16, padding: [80, 80, 80, 80] });
      }

      const draw = new Draw({ source: featuresSource, type: field.type ?? 'Point' });
      map.addInteraction(draw);

      const writeOptions = { decimals: field.decimals ?? 7 };
      draw.on('drawend', ({ feature }) => {
        featuresSource.clear();

        if (disabled) {
          return;
        }

        const geometry = feature.getGeometry();
        if (geometry) {
          onChange(format.writeGeometry(geometry, writeOptions));
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Field
        label={label}
        errors={errors}
        hint={field.hint}
        forSingleList={forSingleList}
        noPadding
        disabled={disabled}
        rootClassName={classNames(
          classes.root,
          disabled && classes.disabled,
          field.required !== false && classes.required,
          hasErrors && classes.error,
          forSingleList && classes['for-single-list'],
        )}
      >
        <div ref={mapContainer} className={classes.map} style={{ height }} />
      </Field>
    );
  };

  MapControl.displayName = 'MapControl';

  return MapControl;
};

export default withMapControl;
