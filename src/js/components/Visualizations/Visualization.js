import React, { Component, PropTypes } from 'react';

import styles from './Visualizations.sass';

import { getPalette, useWhiteFontFromBackgroundHex } from '../../helpers/helpers';

import TreeMap from './Charts/TreeMap';
import PieChart from './Charts/PieChart';
import ColumnChart from './Charts/ColumnChart';
import StackedColumnChart from './Charts/StackedColumnChart';
import ScatterChart from './Charts/ScatterChart';
import LineChart from './Charts/LineChart';
import Histogram from './Charts/Histogram';

export default class Visualization extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.forceUpdate();
  }

  handleClick(event) {
    const { onClick, spec } = this.props;

    if (onClick) {
      onClick(spec.id);
    }
  }

  render() {
    const MAX_ELEMENTS = {
      preview: {
        all: 2000,
        scatter: 500,
        treemap: 200
      },
      full: {
        all: 3000,
        scatter: 1000,
        treemap: 400
      }
    }
    const { data, bins, spec, fieldNameToColor, containerClassName, showHeader, headerClassName, visualizationClassName, overflowTextClassName, isMinimalView, visualizationTypes, sortOrders, sortFields } = this.props;

    const { args, meta } = spec;
    const labels = meta.labels ? meta.labels : {};

    var finalDataArray = data;
    var sortIndex;

    if (sortFields.length && sortOrders.length) {
      var sortField, sortOrder;

      sortFields.forEach(function(s) {
        if (s.selected)
          sortField = s.id;
      });
      sortOrders.forEach(function(s) {
        if (s.selected)
          sortOrder = s.id;
      });
      sortIndex = (sortOrder == 'asc') ? 1 : -1;

      const header = data[0];
      const dataPoints = data.slice(1);
      const sortedDataPoints = dataPoints.sort((a, b) => {
        var aValue = a[sortField];
        if (Array.isArray(aValue)) {
          aValue = (aValue[0] + aValue[1]) / 2
        }
        var bValue = b[sortField];
        if (Array.isArray(bValue)) {
          bValue = (bValue[0] + bValue[1]) / 2
        }
        if (aValue < bValue) {
          return sortIndex * -1;
        }
        else if (aValue > bValue) {
          return sortIndex;
        }
        else {
          return 0;
        }
      });

      finalDataArray = [ header, ...sortedDataPoints ];
    }

    var options = {
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      fontName: 'RobotoDraft',
      fontFamily: 'RobotoDraft',
      fontColor: "#333",
      textStyle: {
        color: "#333"
      },
      chartArea: {
        top: '5%',
        height: '78%',
        left: '15%',
        width: '80%'
      },
      legend: {
        textStyle: {
          color: "#333"
        }
      },
      hAxis: {
        title: labels && labels.x ? labels.x : finalDataArray[0][0],
        titleTextStyle: {
          color: "#333",
          italic: false,
          bold: true
        },
        textStyle: {
          color: "#777",
          italic: false
        }
      },
      vAxis: {
        title: labels && labels.y ? labels.y : finalDataArray[0][1],
        titleTextStyle: {
          color: "#333",
          italic: false,
          bold: true
        },
        textStyle: {
          color: "#777",
          italic: false
        }
      },
      vAxes: [
        {
          textStyle: {
            color: "#777",
            italic: false
          }
        },
        {
          textStyle: {
            color: "#777",
            italic: false
          }
        }
      ]
    };

    if (isMinimalView) {
      options = {
        ...options,
        axisTitlesPosition: 'none',
        chartArea: {
          left: 0,
          top: 0,
          width: '100%',
          height: '100%'
        },
        enableInteractivity: false,
        fontSize: 0,
        hAxis: {
          baselineColor: 'transparent',
          textPosition: 'none',
          gridlines: {
            count: 0,
            color: 'transparent'
          },
        },
        height: 140,
        highlightOnMouseOver: false,
        hintOpacity: 0,
        legend: {
          position: 'none'
        },
        pointSize: 2,
        showTooltips: false,
        textStyle: {
          color: 'transparent',
          fontSize: 0
        },
        tooltip: {
          trigger: 'none'
        },
        vAxis: {
          baselineColor: 'transparent',
          textPosition: 'none',
          gridlines: {
            count: 0,
            color: 'transparent'
          }
        },
        vAxes: [
          {
            baselineColor: 'transparent',
            textPosition: 'none',
            gridlines: {
              count: 0
            }
          },
          {
            baselineColor: 'transparent',
            textPosition: 'none',
            gridlines: {
              count: 0
            }
          }
        ]
      };
    } else {
      options = {
        ...options,
        pointSize: 5,
        width: '100%',
        height: '100%'
      }
    }

    var colors = [];
    var primaryVariableKeys = ['aggField', 'binningField', 'fieldB'];
    for (var i in primaryVariableKeys) {
      var primaryVariableKey = primaryVariableKeys[i];
      if (primaryVariableKey in args) {
        var fieldName = args[primaryVariableKey].name;
        if (fieldName in fieldNameToColor) {
          colors.push(fieldNameToColor[fieldName]);
        }
      }
    }

    if (colors.length > 0) {
      options['colors'] = colors;
    } else {
      options['colors'] = [ '#007BD7' ]
    }

    const validVisualizationTypes = spec.vizTypes.filter((vizType) => visualizationTypes.length == 0 || visualizationTypes.indexOf(vizType) >= 0);

    const tooMuchDataToPreview =
      (isMinimalView &&
        (data.length > MAX_ELEMENTS.preview.all ||
          (validVisualizationTypes[0] == 'tree' && data.length > MAX_ELEMENTS.preview.treemap)
        )
      );
    const tooMuchDataToShowFull =
      (!isMinimalView &&
        (data.length > MAX_ELEMENTS.full.all ||
          (validVisualizationTypes[0] == 'tree' && data.length > MAX_ELEMENTS.full.treemap)
        )
      );

    var tooMuchDataString = '';
    if (tooMuchDataToPreview || tooMuchDataToShowFull) {
      tooMuchDataString = 'Top 20';
      finalDataArray = data.slice(0, 20);
    }

    const noData = finalDataArray.length == 1;
    if (noData) {
      return (
        <div className={ styles.watermark + (isMinimalView ? styles.watermarkNoSpacer : '') }>
          No visualization.
        </div>
      );
    }

    const chartId = `${ this.props.chartId || spec.id }-${ sortIndex }`;

    return (
      <div className={ containerClassName } onClick={ this.handleClick }>
        { showHeader && spec.meta &&
          <div className={ headerClassName }>
            { spec.meta.construction.map(function(construct, i) {
              var style = {};
              var whiteFont = true;
              if (construct.type == 'field') {
                var backgroundColor = fieldNameToColor[construct.string];
                whiteFont = useWhiteFontFromBackgroundHex(backgroundColor);
                style['backgroundColor'] = backgroundColor;
              }

              return <span
                style={ style }
                key={ `construct-${ construct.type }-${ i }` }
                className={
                  `${styles.headerFragment} ${styles[construct.type]}`
                  + ' ' + ( whiteFont ? styles.whiteFont : styles.blackFont )
              }>{ construct.string }</span>
            })}
            { (tooMuchDataToPreview || tooMuchDataToShowFull) &&
              <span className={ `${styles.headerFragment} ${styles.tooMuchData}` }>
                ({ tooMuchDataString })
              </span>
            }
          </div>
        }
        <div className={ styles.visualization
            + ' ' + styles[validVisualizationTypes[0]]
            + (isMinimalView ? ' ' + styles.minimal : '')
            + (visualizationClassName ? ' ' + visualizationClassName : '')
          }>
            { (validVisualizationTypes[0] == 'hist') &&
              <Histogram
                chartId={ `spec-hist-${ chartId }` }
                data={ finalDataArray }
                bins={ bins }
                labels={ labels }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
            { (validVisualizationTypes[0] == 'bar') &&
              <ColumnChart
                chartId={ `spec-bar-${ chartId }` }
                data={ finalDataArray }
                labels={ labels }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
            { (validVisualizationTypes[0] == 'stackedbar' ) &&
              <StackedColumnChart
                chartId={ `spec-stackedbar-${ chartId }` }
                data={ finalDataArray }
                labels={ labels }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
            { (validVisualizationTypes[0] == 'scatter' ) &&
              <ScatterChart
                chartId={ `spec-bar-${ chartId }` }
                data={ finalDataArray }
                labels={ labels }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
            { (validVisualizationTypes[0] == 'line' ) &&
              <LineChart
                chartId={ `spec-bar-${ chartId }` }
                data={ finalDataArray }
                labels={ labels }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
            { validVisualizationTypes[0] == 'pie' &&
              <PieChart
                chartId={ `spec-pie-${ chartId }` }
                data={ finalDataArray }
                labels={ labels }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
            { validVisualizationTypes[0] == 'tree' &&
              <TreeMap
                chartId={ `spec-tree-${ chartId }` }
                parent={ spec.meta.desc }
                data={ finalDataArray }
                labels={ labels }
                options={ options }
                isMinimalView={ isMinimalView }/>
            }
          </div>
      </div>
    );
  }
}

Visualization.propTypes = {
  chartId: PropTypes.string,
  spec: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  visualizationClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  overflowTextClassName: PropTypes.string,
  isMinimalView: PropTypes.bool,
  onClick: PropTypes.func,
  showHeader: PropTypes.bool,
  visualizationTypes: PropTypes.array,
  bins: PropTypes.array,
  sortOrders: PropTypes.array,
  sortFields: PropTypes.array
};

Visualization.defaultProps = {
  chartId: null,
  visualizationClassName: null,
  containerClassName: styles.visualizationBlock,
  headerClassName: styles.header,
  overflowTextClassName: styles.overflowText,
  isMinimalView: false,
  showHeader: false,
  visualizationTypes: [],
  sortOrders: [],
  sortFields: [],
  fieldNameToColor: {}
};
