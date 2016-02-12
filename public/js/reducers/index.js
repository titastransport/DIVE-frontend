import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-react-router';
import { LOAD, SAVE } from 'redux-storage';

import datasets from './datasets';
import datasetSelector from './datasetSelector';
import documents from './documents'
import exportedSpec from './exportedSpec';
import exportedSpecs from './exportedSpecs';
import fieldProperties from './fieldProperties';
import filters from './filters';
import gallerySelector from './gallerySelector';
import project from './project';
import projects from './projects';
import regressionSelector from './regressionSelector';
import specs from './specs';
import summarySelector from './summarySelector';
import transformSelector from './transformSelector';
import user from './user';
import visualization from './visualization';

const rootReducer = combineReducers({
  datasets,
  datasetSelector,
  documents,
  exportedSpec,
  exportedSpecs,
  fieldProperties,
  filters,
  gallerySelector,
  project,
  projects,
  regressionSelector,
  specs,
  summarySelector,
  transformSelector,
  user,
  visualization,
  router
});

export default rootReducer;
