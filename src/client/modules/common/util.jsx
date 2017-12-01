import React from 'react';
import { pick, capitalize } from 'lodash';
import { Field } from 'redux-form';
import { RenderField } from './components/native';

const required = value => (value ? undefined : 'Required');

export const createFormFields = schema => {
  let fields = [];

  for (const key of schema.keys()) {
    if (key !== 'id') {
      const value = schema.values[key];
      let validate = [];
      if (!value.optional) {
        validate.push(required);
      }

      fields.push(
        <Field name={key} key={key} component={RenderField} type="text" label={capitalize(key)} validate={validate} />
      );
    }
  }

  return fields;
};

export const pickInputFields = (schema, values) => {
  return pick(values, schema.keys());
};
