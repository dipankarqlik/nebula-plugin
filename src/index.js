(async () => {
  /********BE CAREFUL WHAT YOU DELETE BELOW THIS LINE********/

  // Get the configuration information from the config.js file
  const config = await await fetch("config").then(response => response.json());

  // Create a JWT token for authenticating the user to a QCS session
  const token = await await fetch("token").then(response => response.json());

  const login = await await fetch(
    `https://${config.tenantDomain}/login/jwt-session?qlik-web-integration-id=${config.qlikWebIntegrationId}`,
    {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token.token}`,
        "qlik-web-integration-id": config.qlikWebIntegrationId
      },
      rejectunAuthorized: false
    }
  );

  //Get the cross-site scripting token to allow requests to QCS from the web app
  const csrfTokenInfo = await await fetch(
    `https://${config.tenantDomain}/api/v1/csrf-token?qlik-web-integration-id=${config.qlikWebIntegrationId}`,
    {
      credentials: "include",
      headers: {
        "Qlik-Web-Integration-ID": config.qlikWebIntegrationId
      }
    }
  );

  // Build the websocket URL to connect to the Qlik Sense applicaiton
  const url = `wss://${config.tenantDomain}/app/${
    config.appId
  }?qlik-web-integration-id=${
    config.qlikWebIntegrationId
  }&qlik-csrf-token=${csrfTokenInfo.headers.get("qlik-csrf-token")}`;

  // Fetch the schema for communicating with Qlik's engine API
  const schema = await (await fetch(
    "https://unpkg.com/enigma.js/schemas/3.2.json"
  )).json();

  // Create Qlik engine session
  const session = window.enigma.create({ schema, url });

  // Open the application
  const app = await (await session.open()).openDoc(config.appId);

  /********BE CAREFUL WHAT YOU DELETE ABOVE THIS LINE********/

  // Create embed configuration
  const nuked = window.stardust.embed(app, {
    context: { theme: "light" },
    types: [
      {
        name: "barchart",
        load: () => Promise.resolve(window["sn-bar-chart"])
      },
      {
        name: "line-chart",
        load: () => Promise.resolve(window["sn-line-chart"])
      },
      {
        // register the scatterplot
        name: "scatterplot",
        load: () => Promise.resolve(window["sn-scatter-plot"])
      },
       {
      // register grid chart
      name: "gridchart",
      load: () => Promise.resolve(window["sn-grid-chart"]),
    },
    ]
  });

  (await nuked.selections()).mount(document.querySelector(".toolbar"));

  nuked.render({
    type: "barchart",
    plugins: [linePlugin, barPlugin],
    element: document.querySelector(".object"),
    fields: ["Decade", "=Count(Distinct Title)"],
    options: {
      direction: "rtl",
      freeResize: true,
      viewState: {
        scrollPosition: 25
      }
    },
    properties: {
      color: { mode: "byDimension" },
      //orientation: "horizontal",
      title: "Bar Chart"
    }
  }),
    nuked.render({
      type: "line-chart",
      element: document.querySelector(".object"),
      plugins: [linePluginNew, minMaxLabelsPluginImplementation, minMaxLabelsPlugin],
      fields: ["Decade", "=Max(Length)", "=Avg(Length)"],

      // Overrides default properties
      properties: {
        title: "Line Chart",
        //lineType: "area",
        //color: '#33ccff',
        dataPoint: {
          show: false,
          showLabels: true
        },
        gridLine: {
          auto: false
        },
        dimensionAxis: {
          show: "all",
          dock: "near"
        },
        measureAxis: {
          // spacing: 0.5,
          // dock: "near",
          show: "all",
          logarithmic: true
        }
      }
    }),
    nuked.render({
      element: document.querySelector(".object"),
      plugins: [pointPlugin, xAxisPlugin, yAxisPlugin, gridLinesPlugin],
      type: "scatterplot",
      fields: [
        "Decade",
        "=Avg(Length)",
        "=Max(Length)",
        "=Count(Distinct Title)"
      ],
      properties: {
        title: "Scatter Plot",
      }
    });
    
})();
