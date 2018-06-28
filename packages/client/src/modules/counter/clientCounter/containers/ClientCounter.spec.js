import React from 'react';
import chai from 'chai';
import { step } from 'mocha-steps';
import { render } from 'react-testing-library';

import Renderer from '../../../../testHelpers/Renderer';
import { click, find } from '../../../../testHelpers/testUtils';
import ClientCounter from './ClientCounter';
import translate from '../../../../i18n';
import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';

chai.should();

const COUNTER_APOLLO_LINK_VALUE = 20;
const INCREMENT = 1;

const resolvers = {
  defaults: {
    counterState: { counter: COUNTER_APOLLO_LINK_VALUE, __typename: 'CounterState' }
  },
  resolvers: {
    Query: {
      counterState: (_, args, { cache }) => {
        const {
          counterState: { counter }
        } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });
        return {
          counter: counter,
          __typename: 'CounterState'
        };
      }
    },
    Mutation: {
      addCounterState: (_, args, { cache }) => {
        const {
          counterState: { counter }
        } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });

        cache.writeData({
          data: {
            counterState: {
              counter: counter + INCREMENT,
              __typename: 'CounterState'
            }
          }
        });
        return null;
      }
    }
  }
};

describe('Apollo link counter example UI works', () => {
  const renderer = new Renderer({}, {}, resolvers);

  let app;
  let container;
  let content;
  const ApolloLinkStateCounterWithI18n = translate('counter')(ClientCounter);

  beforeEach(() => {
    if (app) {
      container = app.container;
      content = container.firstChild;
    }
  });

  step('Counter section renders with link data', () => {
    app = render(renderer.withApollo(<ApolloLinkStateCounterWithI18n />));
    container = app.container;
    content = container.firstChild;
    content.textContent.should.has.string(`Current apolloLinkStateCount, is ${COUNTER_APOLLO_LINK_VALUE}.`);
  });

  step('Clicking on increase counter button shows optimistic response', () => {
    const apolloLinkButton = find(container, '#apollo-link-button');
    click(apolloLinkButton);
    setTimeout(() => {
      content.textContent.should.has.string(`Current apolloLinkStateCount, is ${COUNTER_APOLLO_LINK_VALUE + 1}.`);
    }, 1000);
  });
});