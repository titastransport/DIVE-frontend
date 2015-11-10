import React, { Component, PropTypes } from 'react';
import styles from './landing.sass';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { createProject, fetchPreloadedProjects, wipeProjectState } from '../../actions/ProjectActions';

import RaisedButton from '../Base/RaisedButton';

export class HomePage extends Component {
  componentWillMount() {
    if (this.props.projects.items.length == 0) {
      this.props.fetchPreloadedProjects();
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = nextProps.project.properties.id
    if (this.props.project.properties.id != nextProjectId) {
      this.props.wipeProjectState();
      this.props.pushState(null, `/projects/${ nextProjectId }/data/upload`);
    }
  }

  _onUploadClick() {
    const userId = this.props.user.id;
    const projectTitle = 'Project Title';
    const projectDescription = 'Project Description'
    this.props.createProject(userId, projectTitle, projectDescription);
  }

  render() {
    return (
      <div className={ styles.centeredFill }>
        <div className={ styles.ctaBox }>
          <div className={ styles.primaryCopy }>
            <span>Stop Processing Data and Start <strong>Understanding It</strong></span>
          </div>
          <div className={ styles.secondaryCopy }>
            Merge and query datasets, conduct statistical analyses, and explore
            automatically generated visualizations within seconds.
          </div>
          <div className={ styles.ctaContainer }>
            <RaisedButton
              label="Upload Dataset"
              primary={ true }
              onClick={ this._onUploadClick.bind(this) }
              className={ styles.uploadButton } />
          </div>
        </div>
        <div className={ styles.separater }></div>
        <div className={ styles.preloaded }>
          <div className={ styles.flexbox }>
            <div className={ styles.secondaryCopy + ' ' + styles.emphasis }>Or explore our preloaded projects:</div>
          </div>
          <div className={ styles.projectListContainer }>
            { this.props.projects.isFetching &&
              <div className={ styles.watermark }>Fetching datasets...</div>
            }
            { this.props.projects.items.map((project) =>
              <a key={ `project-button-id-${ project.id }` } href={ `/projects/${ project.id }/visualize` } className={ styles.projectButton }>{ project.title }</a>
            )}
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { project, projects, user } = state;
  return { project, projects, user };
}

export default connect(mapStateToProps, { fetchPreloadedProjects, createProject, wipeProjectState, pushState })(HomePage);