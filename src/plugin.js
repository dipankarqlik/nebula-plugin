const linePlugin = {
  info: {
    name: "line-plugin",
    type: "component-definition"
  },
  fn: ({ keys, layout }) => {
    const componentDefinition = {
      key: "sum-line",
      type: "line",
      layout: { displayOrder: 10 },
      data: { collection: keys.COLLECTION.MAIN },
      settings: {
        coordinates: {
          minor: {
            scale: keys.SCALE.MAIN.MINOR,
            fn: d => d.scale(d.datum.end.value)
          },
          major: { scale: keys.SCALE.MAIN.MAJOR }
        },
        layers: {
          line: {
            stroke: "black",
            strokeWidth: 2,
            opacity: 0.5,
            strokeDasharray: "5 10"
          }
        }
      }
    };
    return componentDefinition;
  }
};

const barPlugin = {
  info: {
    name: "bar-plugin",
    type: "component-definition"
  },
  fn: ({ layout, keys }) => {
    const componentDefinition = {
      type: "box",

      // Provide the same name as the exisiting line component to override it
      key: keys.COMPONENT.BAR,
      settings: {
        box: { width: 0.4, stroke: "black", strokeWidth: 2 }
      }
    };
    return componentDefinition;
  }
};

const linePluginNew = {
  info: {
    name: "line-plugin",
    type: "component-definition"
  },
  fn: ({ layout, keys }) => {
    const componentDefinition = {
      type: "line",

      // Provide the same name as the exisiting line component to override it
      key: keys.COMPONENT.LINE,
      settings: {
        layers: { curve: "monotone", line: { strokeWidth: 3 } }
      }
    };
    return componentDefinition;
  }
};

const gridLinesPlugin = {
  info: {
    name: "grid-lines-plugin",
    type: "component-definition"
  },
  fn: ({ keys, layout }) => {
    const componentDefinition = {
      type: "grid-line",

      // Provide the same name as the exisiting grid-lines component to override it
      key: "grid-lines",
      x: { scale: keys.SCALE.X },
      y: { scale: keys.SCALE.Y },

      // Make the grid lines less imposing than the existing ones
      ticks: {
        show: false
        // stroke: 'gray',
        // strokeDasharray: '1, 5',
      }
    };
    return componentDefinition;
  }
};

const pointPlugin = {
  info: {
    name: "point-plugin",
    type: "component-definition"
  },
  fn: ({ layout, keys }) => {
    const componentDefinition = {
      key: keys.COMPONENT.POINT,
      type: "point",
      settings: {
        strokeWidth: "10px",
        stroke: "black",
        fill: d => {
          if (d.datum.size.value <= 180) {
            return "#993366";
          } else return "#006080";
        }
      }
    };
    return componentDefinition;
  }
};

const xAxisPlugin = {
  info: {
    name: "x-axis-plugin",
    type: "component-definition"
  },
  fn: ({ keys, layout }) => {
    const componentDefinition = {
      type: "axis",

      // Provide the same name as the exisiting x-axis component to override it
      key: keys.COMPONENT.X_AXIS,
      layout: { dock: "bottom" },
      settings: {
        labels: {
          fontFamily: "Cambria, serif",
          fontSize: "15px",
          fill: "dimgray"
        },
        line: { stroke: "#33cccc" }
      }
    };
    return componentDefinition;
  }
};

const yAxisPlugin = {
  info: {
    name: "y-axis-plugin",
    type: "component-definition"
  },
  fn: ({ keys, layout }) => {
    const componentDefinition = {
      type: "axis",

      // Provide the same name as the exisiting y-axis component to override it
      key: keys.COMPONENT.Y_AXIS,
      layout: { dock: "left" },
      settings: {
        labels: {
          fontFamily: "Cambria, serif",
          fontSize: "15px",
          fill: "dimgray"
        },
        line: { stroke: "#33cccc" }
      }
    };
    return componentDefinition;
  }
};

//Custom Plugins:
const minMaxLabelsPluginImplementation = {
  info: {
    componentName: "custom-labels-plugin",
    name: "custom-labels-plugin",
    type: "custom-component"
  },
  fn: ({ keys }) => {
    const implementation = {
      require: ["chart"],
      render() {
        const items = this.chart
          .component(keys.COMPONENT.LINE)
          .data.items.filter(
            item => item.line.value === 1 && item.label >= "1950's"
          );
        const scale = this.chart.scales();
        const timeScale = scale[keys.SCALE.MAIN.MAJOR];
        const lineScale = scale[keys.SCALE.MAIN.MINOR];
        const { width, height } = this.rect;
        const min = Math.min(...items.map(item => item.end.value));
        console.log(min);
        const max = Math.max(...items.map(item => item.end.value));
        const labels = [];
        items.forEach(item => {
          if (item.end.value === min) {
            labels.push({
              type: "text",
              text: `min: ${item.end.label}`,
              x: timeScale(item.major.value) * width,
              y: lineScale(item.end.value) * height + 15,
              anchor: "middle",
              fontFamily: "Helvetica, san-serif",
              fontSize: "15px",
              fill: "darkred"
            });
          } else if (item.end.value === max) {
            labels.push({
              type: "text",
              text: `max: ${item.end.label}`,
              x: timeScale(item.major.value) * width,
              y: lineScale(item.end.value) * height - 10,
              anchor: "middle",
              fontFamily: "Helvetica, san-serif",
              fontSize: "15px",
              fill: "darkgreen"
            });
          }
        });
        return labels;
      }
    };
    return implementation;
  }
};

// Using the min/max labels plugin, defined above
const minMaxLabelsPlugin = {
  info: {
    name: "labels",
    type: "component-definition"
  },
  fn: ({ keys }) => {
    const componentDefinition = {
      // The type has to match with the componentName of the labels plugin definition above
      type: "custom-labels-plugin",
      key: "my-labels"
    };
    return componentDefinition;
  }
};
