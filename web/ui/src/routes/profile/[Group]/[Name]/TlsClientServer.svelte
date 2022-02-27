<script>
    import { createEventDispatcher,
     onMount,
     afterUpdate,
     beforeUpdate, 
     onDestroy, 
     tick } from "svelte";
    import { page } from '$app/stores'
    import { routeViewState, getProfileStateKey } from '$lib/store';
    import {goto} from "$app/navigation";
    import { DataTable } from "carbon-components-svelte";
    import "carbon-components-svelte/css/white.css";
    import { ProgressBar, Loading } from "carbon-components-svelte";
    import Chart from 'chart.js/auto';

    let isLoading = false;

    function setErrorMsg(action, msg) {
      let lineRegex = new RegExp('\r?\n');

        Profile.errorMsg = action + ' -> '+ msg;
        Profile.errorRows = (Profile.errorMsg.split(lineRegex)).length;
        if (Profile.errorRows == 0){
          Profile.errorRows = 1
        } else if (Profile.errorRows > 4){
          Profile.errorRows = 4;
        }
        Profile.isError = true;
    }


    const dispatch = createEventDispatcher ();

    function validateClientIPs (csg_index) {
      let numRegex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/([1-2][0-9]?|3[0-2]?|[4-9])(,(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/([1-2][0-9]?|3[0-2]?|[4-9]))*$', );
      
      const csg = Profile.cs_groups[csg_index];
      const savedCsg = SavedProfile.cs_groups[csg_index];

      csg.client_ipsError = false;
      csg.client_ipsUnsaved = false;
      csg.client_ipsHelp = ''

      if (csg.client_ips.trim() == ''){
        csg.client_ipsHelp = 'required';
        csg.client_ipsError = true;
      } else if (!(csg.client_ips.match(numRegex) && csg.client_ips.match(numRegex)[0] === csg.client_ips)) {
        csg.client_ipsHelp = 'invalid - ip/cidr';
        csg.client_ipsError = true;
      } else if (csg.client_ips != savedCsg.client_ips) {
        csg.client_ipsUnsaved = true;
        csg.client_ipsHelp = "modified"
      }
      
      checkFields();

      Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
    }

    function validateTransactions () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      Profile.transactionsError = false;
      Profile.transactionsUnsaved = false;
      Profile.transactionsHelp = ''

      if (Profile.Transactions.trim() == ''){
        Profile.transactionsHelp = 'required';
        Profile.transactionsError = true;
      } else if (!(Profile.Transactions.match(numRegex) && Profile.Transactions.match(numRegex)[0] === Profile.Transactions)){
        Profile.transactionsHelp = 'invalid - number only';
        Profile.transactionsError = true;
      } else if (Profile.Transactions != SavedProfile.Transactions){
        Profile.transactionsUnsaved = true;
        Profile.transactionsHelp = "modified"
      }

      checkFields();
    }
  
    function validateCps () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      Profile.cpsError = false;
      Profile.cpsUnsaved = false;
      Profile.cpsHelp = ''
      

      if (Profile.CPS.trim() == ''){
        Profile.cpsHelp = 'required';
        Profile.cpsError = true;
      } else if (!(Profile.CPS.match(numRegex) && Profile.CPS.match(numRegex)[0] === Profile.CPS)){
        Profile.cpsHelp = 'invalid - number only';
        Profile.cpsError = true;
      } else if (Profile.CPS != SavedProfile.CPS){
        Profile.cpsUnsaved = true;
        Profile.cpsHelp = "modified"
      }

      checkFields();
    }

    function validateDataLength () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      Profile.dataLengthError = false;
      Profile.dataLengthUnsaved = false;
      Profile.dataLengthHelp = ''

      if (Profile.DataLength.trim() == ''){
        Profile.dataLengthHelp = 'required';
        Profile.dataLengthError = true;
      } else if (!(Profile.DataLength.match(numRegex) && Profile.DataLength.match(numRegex)[0] === Profile.DataLength)){
        Profile.dataLengthHelp = 'invalid - number only';
        Profile.dataLengthError = true;
      } else if (Profile.DataLength != SavedProfile.DataLength){
        Profile.dataLengthUnsaved = true;
        Profile.dataLengthHelp = "modified"
      }

      checkFields();
    }

    function validateMaxPipeline () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      Profile.maxPipelineError = false;
      Profile.maxPipelineUnsaved = false;
      Profile.maxPipelineHelp = ''

      if (Profile.MaxPipeline.trim() == ''){
        Profile.maxPipelineHelp = 'required';
        Profile.maxPipelineError = true;
      } else if (!(Profile.MaxPipeline.match(numRegex) && Profile.MaxPipeline.match(numRegex)[0] === Profile.MaxPipeline)){
        Profile.maxPipelineHelp = 'invalid - number only';
        Profile.maxPipelineError = true;
      } else if (Profile.MaxPipeline != SavedProfile.MaxPipeline){
        Profile.maxPipelineUnsaved = true;
        Profile.maxPipelineHelp = "modified"
      }

      checkFields();
    }

    function validateClientIface () {
      let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

      Profile.clientIfaceError = false;
      Profile.clientIfaceUnsaved = false;
      Profile.clientIfaceHelp = ''

      if (Profile.ClientIface.trim() == ''){
        Profile.clientIfaceHelp = 'required';
        Profile.clientIfaceError = true;
      } else if (!(Profile.ClientIface.match(numRegex) && Profile.ClientIface.match(numRegex)[0] === Profile.ClientIface)){
        Profile.clientIfaceHelp = 'invalid - node:port';
        Profile.clientIfaceError = true;
      } else if (Profile.ClientIface != SavedProfile.ClientIface){
        Profile.clientIfaceUnsaved = true;
        Profile.clientIfaceHelp = "modified"
      }

      checkFields();
    }

    function validateServerIface () {
      let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

      Profile.serverIfaceError = false;
      Profile.serverIfaceUnsaved = false;
      Profile.serverIfaceHelp = ''

      if (Profile.ServerIface.trim() == ''){
        Profile.serverIfaceHelp = 'required';
        Profile.serverIfaceError = true;
      } else if (!(Profile.ServerIface.match(numRegex) && Profile.ServerIface.match(numRegex)[0] === Profile.ServerIface)){
        Profile.serverIfaceHelp = 'invalid - node:port';
        Profile.serverIfaceError = true;
      } else if (Profile.ServerIface != SavedProfile.ServerIface){
        Profile.serverIfaceUnsaved = true;
        Profile.serverIfaceHelp = "modified"
      }

      checkFields();
    }

    function checkFields() {

      Profile.markUnsavedFields = Profile.transactionsUnsaved 
                    || Profile.cpsUnsaved
                    || Profile.dataLengthUnsaved
                    || Profile.maxPipelineUnsaved
                    || Profile.clientIfaceUnsaved
                    || Profile.serverIfaceUnsaved;

      Profile.markErrorFields = Profile.transactionsError 
                    || Profile.cpsError
                    || Profile.dataLengthError
                    || Profile.maxPipelineError
                    || Profile.clientIfaceError
                    || Profile.serverIfaceError;

      for (const csg of Profile.cs_groups) {
        if (csg.fieldAttention == 'mark-delete') {
          Profile.markUnsavedFields = true;
          continue;
        }

        csg.fieldAttention = '';
        if (csg.client_ipsError) {
          Profile.markErrorFields = true;
          csg.fieldAttention = 'field-update';
        }
        if (csg.client_ipsUnsaved) {
          Profile.markUnsavedFields = true;
          csg.fieldAttention = 'field-update';
        }
      }

      checkLastCSG ();
    }

    function validateAllFields() {
      validateTransactions ();
      validateCps ();
      validateDataLength ();
      validateMaxPipeline ();
      validateClientIface ();
      validateServerIface ();

      for (let i=0; i < Profile.cs_groups.length; i++) {
        validateClientIPs (i)
      }
    }

    async function onSave () {
      Profile.isTransient = true;

      const action = 'onSave'; 
      const p = profileNormalize (Profile);

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        Profile.errorMsg = '';
        Profile.isError = false;
        Profile.isProgress = true;
        const res = await fetch ('/api/profiles.json', {
          signal,
          method: 'PUT',
          body: JSON.stringify(p)
        });

        if (res.ok) {
          const text = await res.text();
          let isJson = true;
          let json = {};
          try {
            json = JSON.parse (text);
          } catch (e) {
            isJson = false;
          }

          if (isJson) {
            if (json.status == 0){

              const routeViewKey = getProfileStateKey ($page.stuff.Profile.Group, $page.stuff.Profile.Name);
              delete $routeViewState[routeViewKey];

              const connStats = Profile.connStats;
              const connStatsSaved = SavedProfile.connStats;

              const latencyStats = Profile.latencyStats;
              const errStatsSaved = SavedProfile.latencyStats;

              Profile = profileCanonical(p);
              SavedProfile = profileCanonical(p);

              Profile.connStats = connStats;
              SavedProfile.connStats = connStatsSaved;

              Profile.latencyStats = latencyStats;
              SavedProfile.latencyStats = errStatsSaved;

              $routeViewState[routeViewKey] = {Profile, SavedProfile};
              validateAllFields ();
            } else {
              console.log(json);
              setErrorMsg (action, json.message);
            }
          } else {
            setErrorMsg (action, text); 
          }
          Profile.isProgress = false;
        } else {
          console.log(res);
          setErrorMsg (action, res.statusText);
          Profile.isProgress = false;
        }
      } catch (e) {
        setErrorMsg (action, e.toString());
        Profile.isProgress = false;
      }
      Profile.isTransient = false;
    }

    async function onStop () {
      Profile.isTransient = true;
      let action = 'onStop';

      restartWS ();

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        Profile.errorMsg = '';
        Profile.isError = false;
        Profile.isProgress = true;
        Profile.progressText = 'Stop ...';
        const res = await fetch ('/api/profile_runs.json', {
          signal,
          method: 'DELETE',
          body: JSON.stringify({'Group': Profile.Group,
                                  'Name': Profile.Name})
        });

        if (res.ok) {
          const text = await res.text();
          let isJson = true;
          let json = {};
          try {
            json = JSON.parse (text);
          } catch (e) {
            isJson = false;
          }

          if (isJson) {
            if (json.status == 0){
            } else {
              console.log(json);
              setErrorMsg (action, json.message);
              Profile.isProgress = false;
            }
          } else {
            setErrorMsg (action, text);
            Profile.isProgress = false;
          }
        } else {
          console.log(res);
          setErrorMsg (action, res.statusText);
          Profile.isProgress = false;
        }
      } catch (e) {
        setErrorMsg (action, e.toString());
        Profile.isProgress = false;
      }

      Profile.isTransient = false;
    }
    
    function getConnStats () {
      return JSON.parse (JSON.stringify ([
        {id: 1,
          Name: 'TcpInit',
          Client: 0,
          Server: 0},

          {id: 2,
          Name: 'TcpConn',
          Client: 0,
          Server: 0},

          {id: 3,
          Name: 'SslInit',
          Client: 0,
          Server: 0},

          {id: 4,
          Name: 'SslConn',
          Client: 0,
          Server: 0},

          {id: 5,
          Name: 'ActConn',
          Client: 0,
          Server: 0},

          {id: 6,
          Name: 'ConnFail',
          Client: 0,
          Server: 0}
        ]));
    }

    function getLatencyStats () {
      return JSON.parse (JSON.stringify ([
        {id: 1,
          Name: 'TcpAvgLat',
          Client: 0,
          Server: 0},

          {id: 2,
          Name: 'TlsAvgLat',
          Client: 0,
          Server: 0},

          {id: 3,
          Name: 'AppAvgLat',
          Client: 0,
          Server: 0},

          {id: 4,
          Name: 'BytesSent',
          Client: 0,
          Server: 0},

          {id: 5,
          Name: 'BytesRcvd',
          Client: 0,
          Server: 0},

          {id: 6,
          Name: 'SessFail',
          Client: 0,
          Server: 0}
        ]));
    }

    async function clearStats () {
      Profile.connStats = getConnStats();
      SavedProfile.connStats = getConnStats();

      Profile.latencyStats = getLatencyStats();
      SavedProfile.latencyStats = getLatencyStats();

      // cpsChartDataSet[0].data = [];
      // cpsChartDataSet[1].data = [];
      // cpsChartDataSet[2].data = [];
      // cpsChartDataSet[3].data = [];

      // clntThptChartDataSet[0].data = [];
      // clntThptChartDataSet[1].data = [];
      // clntThptChartDataSet[2].data = [];

      // srvrThptChartDataSet[0].data = [];
      
      // cpsChart.update();
      // clntThptChart.update();
      // srvrThptChart.update();

      // await tick();
    }

    async function onStart () {
      Profile.isTransient = true;
      clearStats ();

      restartWS ();

      const action = 'onStart';
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        Profile.errorMsg = '';
        Profile.isError = false;
        Profile.isProgress = true;
        Profile.progressText = 'Start ...';
        const res = await fetch ('/api/profile_runs.json', {
          signal,
          method: 'POST',
          body: JSON.stringify({'Group': Profile.Group,
                                  'Name': Profile.Name})
        });

        if (res.ok) {
          const text = await res.text();
          let isJson = true;
          let json = {};
          try {
            json = JSON.parse (text);
          } catch (e) {
            isJson = false;
          }

          if (isJson) {
            if (json.status == 0){
              Profile.isRunning = true;
            } else {
              console.log(json);
              setErrorMsg (action, json.message);
              Profile.isProgress = false;
            }
          } else {
            setErrorMsg (action, text);
            Profile.isProgress = false;
          }
        } else {
          console.log(res);
          setErrorMsg (action, res.statusText);
          Profile.isProgress = false;
        }
      } catch (e) {
        setErrorMsg (action, e.toString());
        Profile.isProgress = false;
      }
      Profile.isTransient = false;
    }


    async function onStartCapture () {
      Profile.isTransient = true;
      clearStats ();

      const action = 'onStartCapture';
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        Profile.errorMsg = '';
        Profile.isError = false;
        Profile.isProgress = true;
        Profile.progressText = 'Capture On...';
        const res = await fetch ('/api/profile_tcpdump', {
          signal,
          method: 'POST',
          body: JSON.stringify({'Group': Profile.Group,
                                  'Name': Profile.Name})
        });

        if (res.ok) {
          const text = await res.text();
          let isJson = true;
          let json = {};
          try {
            json = JSON.parse (text);
          } catch (e) {
            isJson = false;
          }

          if (isJson) {
            if (json.status == 0){
              Profile.isCapturing = true;
              Profile.isProgress = false;
            } else {
              console.log(json);
              setErrorMsg (action, json.message);
              Profile.isProgress = false;
            }
          } else {
            setErrorMsg (action, text);
            Profile.isProgress = false;
          }
        } else {
          console.log(res);
          setErrorMsg (action, res.statusText);
          Profile.isProgress = false;
        }
      } catch (e) {
        setErrorMsg (action, e.toString());
        Profile.isProgress = false;
      }
      Profile.isTransient = false;
    }

    async function onStopCapture () {
      Profile.isTransient = true;
      clearStats ();

      const action = 'onStopCapture';
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        Profile.errorMsg = '';
        Profile.isError = false;
        Profile.isProgress = true;
        Profile.progressText = 'Capture Off...';
        const res = await fetch ('/api/profile_tcpdump', {
          signal,
          method: 'DELETE',
          body: JSON.stringify({'Group': Profile.Group,
                                  'Name': Profile.Name})
        });

        if (res.ok) {
          const text = await res.text();
          let isJson = true;
          let json = {};
          try {
            json = JSON.parse (text);
          } catch (e) {
            isJson = false;
          }

          if (isJson) {
            if (json.status == 0){
              Profile.isCapturing = false;
              Profile.isProgress = false;
            } else {
              console.log(json);
              setErrorMsg (action, json.message);
              Profile.isProgress = false;
            }
          } else {
            setErrorMsg (action, text);
            Profile.isProgress = false;
          }
        } else {
          console.log(res);
          setErrorMsg (action, res.statusText);
          Profile.isProgress = false;
        }
      } catch (e) {
        setErrorMsg (action, e.toString());
        Profile.isProgress = false;
      }
      Profile.isTransient = false;
    }

    async function onAddTrafficPath () {

      Profile.isTransient = true;

      let action = 'onAddTrafficPath';

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const group = Profile.Group;
        const name = Profile.Name;
        const newcsg = Profile.cs_groups.length;
        Profile.errorMsg = '';
        Profile.isError = false;
        Profile.isProgress = true;
        Profile.progressText = 'Add Path ...';
        const res = await fetch (`/api/profiles.json?group=${group}&name=${name}&newcsg=${newcsg}`);
        if (res.ok) {
          const text = await res.text();
          let isJson = true;
          let json = {};
          try {
            json = JSON.parse (text);
          } catch (e) {
            isJson = false;
          }

          if (isJson) {
            if (json.status == 0){
              const csg = json.data;
              csg.id = csg.app_id;
              csg.client_ips = csg.client_ips.join(',');
              Profile.cs_groups.push (csg);
              Profile.cs_groups = [...Profile.cs_groups];
              Profile.markUnsavedFields = true;
            } else {
              console.log(json);
              setErrorMsg (action, json.message);
              Profile.isProgress = false;
            }
          } else {
            setErrorMsg (action, text);
            Profile.isProgress = false;
          }
        } else {
          console.log(res);
          setErrorMsg (action, res.statusText);
          Profile.isProgress = false;
        }
      } catch (e) {
        setErrorMsg (action, e.toString());
        Profile.isProgress = false;
      }

      Profile.isTransient = false;
    }

    function checkLastCSG () {
      Profile.isLastCSG = false;

      let csg_count = 0;
      for (const csg of Profile.cs_groups) {
        if (csg.fieldAttention == 'mark-delete') {
          continue;
        }
        csg_count += 1;
      }

      if ( csg_count == 1) {
        Profile.isLastCSG = true;
      }

      return Profile.isLastCSG
    }

    function onMarkUnmarkDelete (row_index) {
      if (Profile.cs_groups[row_index].fieldAttention == 'mark-delete') {
        Profile.cs_groups[row_index].fieldAttention = '';
        checkFields();
      } else if (!checkLastCSG()) {
        Profile.cs_groups[row_index].fieldAttention = 'mark-delete';
        Profile.markUnsavedFields = true;
      }
    }

    async function onProfileAction () {
      if (Profile.isRunning) {     
        await onStop();
        if (Profile.isCapturing) {
          await onStopCapture();
        }
      } else {
        if (Profile.markUnsavedFields || Profile.markErrorFields) {
          await onSave();
        } else {
          await onStartCapture();
          await onStart();
        }
      }
    }

    async function onCaptureAction () {
      if (Profile.isCapturing) {
        await onStopCapture();
      } else {
        await onStartCapture();
      }
    }

    let statsWS = null;

    let cpsChartCtx;
    let cpsChartCanvas;
    let cpsChart;

    let clntThptChartCtx;
    let clntThptChartCanvas;
    let clntThptChart;

    let srvrThptChartCtx;
    let srvrThptChartCanvas;
    let srvrThptChart;

    const csGroupHeaders = [
      {key: 'app_id', value: 'Group'},
      {key: 'client_ips', value: 'Client'},
      {key: 'server_ip', value: 'Server'},
      {key: 'server_ssl', value: 'Protocol'},
      {key: 'server_port', value: 'Port'},
      {key: 'fieldAttention', value: ''}
    ];

    const topStatsHeaders = [
      {key: 'Name', value: 'Name'},
      {key: 'Client', value: 'Client'},
      {key: 'Server', value: 'Server'}
    ];

    const latencyStatsHeaders = [
      {key: 'Name', value: 'Name'},
      {key: 'Client', value: 'Client'},
      {key: 'Server', value: 'Server'}
    ];

  function profileCanonical (p) {

    const p2 = JSON.parse(JSON.stringify(p));

    //all number field to string
    p2.Transactions = p2.Transactions.toString();
    p2.CPS = p2.CPS.toString();
    p2.DataLength = p2.DataLength.toString();
    p2.MaxPipeline = p2.MaxPipeline.toString();

    //for table header and row
    for (const csg of p2.cs_groups) {
      csg.id = csg.app_id;
      csg.client_ips = csg.client_ips.join(',');
    }

    return p2;
  }

  function profileNormalize (p) {
    const p2 = {};

    p2.Group = p.Group;
    p2.Name = p.Name;
    p2.Type = p.Type;


    p2.Transactions = parseInt(p.Transactions);
    p2.CPS = parseInt(p.CPS);
    p2.DataLength = parseInt(p.DataLength);
    p2.MaxPipeline = parseInt(p.MaxPipeline);
    p2.ClientIface = p.ClientIface;
    p2.ServerIface = p.ServerIface;

    let csg_count = 0;
    for (const csg of p.cs_groups) {
      if (csg.fieldAttention == 'mark-delete') {
        continue;
      }
      csg_count += 1;
    }

    p2.cs_groups = [];
    let csg_index = 0;
    for (const csg of p.cs_groups) {

      if (csg.fieldAttention == 'mark-delete') {
        continue;
      }

      const csg2 = {};

      csg2.index = csg_index;
      csg_index += 1;

      csg2.client_ips = csg.client_ips.split(',');
      csg2.server_ip = csg.server_ip;

      csg2.app_id = "CSG" + csg_index.toString();
        
      csg2.app_gid = csg.app_gid;

      csg2.server_port = csg.server_port;
      csg2.server_ssl = csg.server_ssl;
      csg2.send_recv_len = p2.DataLength;
      csg2.cps = Math.floor (p2.CPS / csg_count); 
      csg2.max_active_conn_count = Math.floor (p2.MaxPipeline / csg_count);
      csg2.total_conn_count = Math.floor (p2.Transactions / csg_count);
      csg2.server_key = csg.server_key
      csg2.server_cert = csg.server_cert

      p2.cs_groups.push (csg2);
    }

    return p2;
  }

  let Profile = null;
  let SavedProfile = null;

  async function restartWS () {
    
    if (statsWS) {
      statsWS.close();
      statsWS = null;
    }

    const wsPort = parseInt($page.url.port) + 2;
    const wsHost = $page.url.hostname;
    const wsUrl = 'ws://' + wsHost + ':' + wsPort + '/ws';

    statsWS = new WebSocket (wsUrl);

    statsWS.addEventListener ('open', async () => {
      await statsWS.send (JSON.stringify({Group: Profile.Group, Name: Profile.Name}));
    });

    statsWS.addEventListener ('close', () => {
    });

    statsWS.addEventListener ('message', async (event) => {

      try {
        let json = JSON.parse (event.data);

        Profile.Stats = json.stats;
        const task =json.task;
        Profile.isCapturing = json.capon;

        Profile.isRunning = (task.State == 'run');
        Profile.isProgress = (task.Status == 'progress');
        Profile.progressText = task.Events.length ? task.Events[task.Events.length-1] : Profile.progressText;
        
        if (Profile.Stats.TlsClient.sum.tci >=0 
                  && Profile.Stats.TlsServer.sum.tci >= 0) {
          Profile.connStats[0].Client = Profile.Stats.TlsClient.sum.tci;
          Profile.connStats[1].Client = Profile.Stats.TlsClient.sum.tcis;
          Profile.connStats[2].Client = Profile.Stats.TlsClient.sum.sci;
          Profile.connStats[3].Client = Profile.Stats.TlsClient.sum.scis;
          Profile.connStats[4].Client = Profile.Stats.TlsClient.sum.tac;
          Profile.connStats[5].Client = Profile.Stats.TlsClient.sum.tcif + Profile.Stats.TlsClient.sum.scif;

          Profile.connStats[0].Server = 0;
          Profile.connStats[1].Server = Profile.Stats.TlsServer.sum.tas;
          Profile.connStats[2].Server = 0;
          Profile.connStats[3].Server = Profile.Stats.TlsServer.sum.sas;
          Profile.connStats[4].Server = Profile.Stats.TlsServer.sum.tac;
          Profile.connStats[5].Server = 0;

          Profile.latencyStats[0].Client = Profile.Stats.TlsClient.sum.tcal;
          Profile.latencyStats[1].Client = Profile.Stats.TlsClient.sum.scal;
          Profile.latencyStats[2].Client = Profile.Stats.TlsClient.sum.adal;
          Profile.latencyStats[3].Client = Profile.Stats.TlsClient.sum.adbs;
          Profile.latencyStats[4].Client = Profile.Stats.TlsClient.sum.adbr;
          Profile.latencyStats[5].Client = Profile.Stats.TlsClient.sum.asprt;

          Profile.latencyStats[0].Server = 0;
          Profile.latencyStats[1].Server = 0;
          Profile.latencyStats[2].Server = 0;
          Profile.latencyStats[3].Server = Profile.Stats.TlsServer.sum.adbs;
          Profile.latencyStats[4].Server = Profile.Stats.TlsServer.sum.adbr;
          Profile.latencyStats[5].Server = Profile.Stats.TlsServer.sum.asprt;


          cpsChartDataSet[0].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.tcir);
          cpsChartDataSet[1].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.tcisr);
          cpsChartDataSet[2].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.scir);
          cpsChartDataSet[3].data = Profile.Stats.tickStats.TlsClient.map(v => v.scisr);

          clntThptChartDataSet[0].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.dt);
          clntThptChartDataSet[1].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.dst);
          clntThptChartDataSet[2].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.drt);

          srvrThptChartDataSet[0].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.adal);

          cpsChart.update();
          clntThptChart.update();
          srvrThptChart.update();
        }
      } catch (e) {

      }

      isLoading = false;
      await statsWS.send (JSON.stringify({Group: Profile.Group, Name: Profile.Name}));

    });    
  }


  beforeUpdate ( async () => {

    const routeViewKey = getProfileStateKey ($page.stuff.Profile.Group, $page.stuff.Profile.Name);

    if (Profile 
            && Profile.Group == $page.stuff.Profile.Group
            && Profile.Name == $page.stuff.Profile.Name) {

      //skip updating Profile; as this is case of field update
    } else {
      isLoading = true;

      if ($routeViewState[routeViewKey]) {
        Profile = $routeViewState[routeViewKey].Profile;
        SavedProfile = $routeViewState[routeViewKey].SavedProfile;

        clearStats ();
        validateAllFields ();
        checkLastCSG ();
      } else {

        Profile = profileCanonical ($page.stuff.Profile);
        SavedProfile = profileCanonical ($page.stuff.Profile);

        $routeViewState[routeViewKey] = {Profile, SavedProfile};

        clearStats ();
        validateAllFields ();
        checkLastCSG ();
      }

      restartWS();
    }
  });

  afterUpdate ( async () => {
    // cpsChart.update();
  })


  // let cpsChartDataSet = [{
  //   barPercentage: 0.4,
  //   borderColor: 'rgb(89, 112, 115)',
  //   backgroundColor: 'rgb(89, 112, 115)',
  //   data: [0, 0, 0, 0]
  // }]

  let cpsChartDataSet = [{
    fill: false,
    borderWidth: 2,
    lineTension: 0.1,
    borderColor: 'rgb(89, 112, 115)',
    data: []
  },
  {
    fill: false,
    borderWidth: 2,
    lineTension: 0.2,
    borderColor: 'rgb(114, 137, 218)',
    data: []
  },
  {
    fill: false,
    borderWidth: 2,
    lineTension: 0.3,
    borderColor: 'rgb(186, 225, 255)',
    data: []
  },
  {
    fill: false,
    borderWidth: 2,
    lineTension: 0.4,
    borderColor: 'rgb(255, 204, 92)',
    data: []
  }];


  let clntThptChartDataSet = [{
    fill: true,
    borderWidth: 2,
    lineTension: 0.1,
    borderColor: 'rgb(89, 112, 115)',
    data: []
  },
  {
    fill: false,
    borderWidth: 2,
    lineTension: 0.2,
    borderColor: 'rgb(114, 137, 218)',
    data: []
  },
  {
    fill: false,
    borderWidth: 2,
    lineTension: 0.3,
    borderColor: 'rgb(186, 225, 255)',
    data: []
  }];

  let srvrThptChartDataSet = [{
    fill: true,
    borderWidth: 2,
    lineTension: 0.1,
    borderColor: 'rgb(255, 204, 92)',
    data: []
  }];
  
  
  let clntThptChartLables = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];


  onMount ( () => {
  
    // cpsChartCtx = cpsChartCanvas.getContext('2d');
    // cpsChart = new Chart(cpsChartCtx, {
    //     type: 'bar',
    //     data: {
    //       labels: ['tcpInit', 'tcpSucc', 'sslInit', 'sslSucc'],
    //       datasets: cpsChartDataSet
    //     },
    //     options: {
    //       scales: {
    //         y: {
    //           beginAtZero: true
    //         }
    //       },
    //       plugins: {
    //         legend: false
    //       }
    //     }
    // });

    cpsChartCtx = cpsChartCanvas.getContext('2d');
    cpsChart = new Chart(cpsChartCtx, {
        type: 'line',
        data: {
          labels: clntThptChartLables,
          datasets: cpsChartDataSet
        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          animation :{
            duration: 0
          },
          interaction: {
            intersect: false
          },
          plugins: {
            legend: false,
            title: {
              display: true,
              text: 'CPS'
            }
          },
          scales: {
            x: {
              type: 'linear'
            },
            y: {
              beginAtZero: true
            }
          }
        }
    });

    clntThptChartCtx = clntThptChartCanvas.getContext('2d');
    clntThptChart = new Chart(clntThptChartCtx, {
        type: 'line',
        data: {
          labels: clntThptChartLables,
          datasets: clntThptChartDataSet
        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          animation :{
            duration: 0
          },
          interaction: {
            intersect: false
          },
          plugins: {
            legend: false,
            title: {
              display: true,
              text: 'Throughput'
            }
          },
          scales: {
            x: {
              type: 'linear'
            },
            y: {
              beginAtZero: true
            }
          }
        }
    });

    srvrThptChartCtx = srvrThptChartCanvas.getContext('2d');
    srvrThptChart = new Chart(srvrThptChartCtx, {
      type: 'line',
        data: {
          labels: clntThptChartLables,
          datasets: srvrThptChartDataSet
        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          animation :{
            duration: 0
          },
          interaction: {
            intersect: false
          },
          plugins: {
            legend: false,
            title: {
              display: true,
              text: 'Latency'
            }
          },
          scales: {
            x: {
              type: 'linear'
            },
            y: {
              beginAtZero: true
            }
          }
        }
    });
  });

  onDestroy ( () => {
    if (statsWS) {
      statsWS.close();
      statsWS = null;
    }
  });

</script>

{#if isLoading}
  <Loading withOverlay={true} small/>  
{/if}


<nav class="breadcrumb is-left breadcrumb-margin" aria-label="breadcrumbs">
  <ul>
      <!-- svelte-ignore a11y-missing-attribute -->
      <li class="is-active" ><a>Profile</a></li>

      <!-- svelte-ignore a11y-missing-attribute -->
      <li class="is-active" ><a>{Profile.Group}</a></li>

      <!-- svelte-ignore a11y-missing-attribute -->
      <li class="is-active" ><a>{Profile.Type} : {Profile.Name}</a></li>

      <!-- svelte-ignore a11y-missing-attribute -->
      <li class="is-active"><a> <strong class="{Profile.markUnsavedFields || Profile.markErrorFields ? 'errmsg' : ''}">&nbsp;&nbsp;{Profile.markUnsavedFields ? "Unsaved Fields" : ""} &nbsp;&nbsp;{Profile.markErrorFields ? "Error Fields" : ""}</strong> </a></li>
  </ul>
</nav>

<div class="columns is-multiline is-mobile profile-margin">

    <div class="column is-12">
      <div class="tile is-ancestor is-mobile">
        <div class="tile is-4 is-parent">
          <div class="tile is-child my-border">
            <section>
              <div class="columns is-multiline is-mobile start_stop_border">
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">Transactions</label>
                    <div class="control">
                      <input class="input {(Profile.transactionsError || Profile.transactionsUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.Transactions}
                        on:input={validateTransactions}
                      >
                      <p class="help msg_border">{Profile.transactionsHelp}</p>
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">CPS</label>
                    <div class="control">
                      <input class="input {(Profile.cpsError || Profile.cpsUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.CPS}
                        on:input={validateCps}
                      >
                      <p class="help msg_border">{Profile.cpsHelp}</p>
                    </div>
                  </div>
                </div>

                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">DataLength</label>
                    <div class="control">
                      <input class="input {(Profile.dataLengthError || Profile.dataLengthUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.DataLength}
                        on:input={validateDataLength}
                      >
                      <p class="help msg_border">{Profile.dataLengthHelp}</p>
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">MaxPipeline</label>
                    <div class="control">
                      <input class="input {(Profile.maxPipelineError || Profile.maxPipelineUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.MaxPipeline}
                        on:input={validateMaxPipeline}
                      >
                      <p class="help msg_border">{Profile.maxPipelineHelp}</p>
                    </div>
                  </div>
                </div>

                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">ClientPort</label>
                    <div class="control">
                      <input class="input {(Profile.clientIfaceError || Profile.clientIfaceUnsaved) ? 'is-danger' : ''}"
                        bind:value={Profile.ClientIface}
                        type=""
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        on:input={validateClientIface}
                      >
                      <p class="help msg_border">{Profile.clientIfaceHelp}</p>
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">ServerPort</label>
                    <div class="control">
                      <input class="input {(Profile.serverIfaceError || Profile.serverIfaceUnsaved) ? 'is-danger' : ''}"
                        bind:value={Profile.ServerIface}
                        type=""
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        on:input={validateServerIface}
                      >
                      <p class="help msg_border">{Profile.serverIfaceHelp}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field has-text-centered">
                <div class="control has-text-centered" >
                  <button class="button {Profile.isRunning ? 'is-danger is-light' : 'is-info'}" 
                    disabled={Profile.isTransient || (!Profile.isRunning && Profile.markErrorFields)}
                    on:click={onProfileAction} > 
                      {#if Profile.isRunning}
                        Stop Traffic
                      {:else}
                        {#if Profile.markUnsavedFields || Profile.markErrorFields}
                          Save Profile
                        {:else}
                          Start Traffic
                        {/if} 
                      {/if}
                  </button>

                  <button class="button is-light is-info" 
                    disabled={Profile.isTransient || (!Profile.isRunning)}
                    on:click={onCaptureAction} > 
                      {#if Profile.isCapturing}
                        Stop Capture
                      {:else}
                        Start Capture
                      {/if}
                  </button>
                </div>
              </div>
            </section> 

          </div>
        </div>
        <div class="tile is-4 is-parent">
          <div class="tile is-child my-border">
            <DataTable
            size="short"
            headers={topStatsHeaders}
            rows={Profile.connStats}
            zebra
            />
          </div>
        </div>
        <div class="tile is-4 is-parent">
          <div class="tile is-child my-border">
            <DataTable
            size="short"
            headers={latencyStatsHeaders}
            rows={Profile.latencyStats}
            zebra
            />
          </div>
        </div>
      </div>
    </div>

    <div class="column is-12">
      {#if Profile.isProgress}
        <div class="field">
          <div class="control" >
            <ProgressBar helperText="{Profile.progressText}"/>
          </div>
        </div>
      {/if}

      {#if Profile.isError}
        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Status</label>
          <div class="control">
            <textarea class="textarea errmsg" placeholder="" rows="{Profile.errorRows}" value={Profile.errorMsg} readonly/>
          </div>
        </div>          
      {/if}
    </div>  

    <div class="column is-12">
      <div class="tile is-ancestor is-mobile">
        <div class="tile is-4 is-parent">
          <div class="tile is-child my-border">
            <canvas bind:this={cpsChartCanvas} id="cpsChart"></canvas>
          </div>
        </div>
        <div class="tile is-4 is-parent">
          <div class="tile is-child my-border">
            <canvas bind:this={clntThptChartCanvas} id="clntThptChart"></canvas>
          </div>
        </div>
        <div class="tile is-4 is-parent">
          <div class="tile is-child my-border">
            <canvas bind:this={srvrThptChartCanvas} id="srvrThptChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="column is-12">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label ">Traffic Paths:</label>
      <DataTable
        expandable
        headers={csGroupHeaders}
        rows={Profile.cs_groups}
        size="medium"
        >
        <div slot="expanded-row" let:row>
          <div class="columns is-multiline is-mobile">
            <div class="column is-2">
            </div>

            <div class="column is-8">
              <div class="columns is-multiline is-mobile">


                <div class="column is-half">

                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">Client IPs</label>
                    <div class="control">
                      <input class="input {(Profile.cs_groups[row.index].client_ipsError || Profile.cs_groups[row.index].client_ipsUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.cs_groups[row.index].client_ips}
                        on:input={() => validateClientIPs(row.index)}
                      >
                      <p class="help">{Profile.cs_groups[row.index].client_ipsHelp}</p>
                    </div>
                  </div>
              
              </div>
              
              
              <div class="column is-half">
              
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">Server IP</label>
                    <div class="control">
                      <input class="input " 
                      type="text" 
                      placeholder=""
                      bind:value={Profile.cs_groups[row.index].server_ip}
                      >
                    </div>
                  </div>
              
              </div>
              
              
              <div class="column is-half">
              
                  <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Protocol</label>
                      <div class="select is-fullwidth ">
                        <select class="">
                          <option>TLS</option>
                          <option>TCP</option>
                        </select>
                      </div>
                  </div>
              
              </div>
              
              
              
              <div class="column is-half">
              
                  <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Server Port</label>
                      <div class="control">
                        <input class="input " 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.cs_groups[row.index].server_port}
                        >
                      </div>
                  </div>
              
              </div>
              
              
              
              <div class="column is-half">
              
                  <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">TLS Version</label>
                      <div class="select is-fullwidth ">
                        <select class="">
                          <option>All</option>
                        </select>
                      </div>
                  </div>
              
              </div>
              
              
              
              
              <div class="column is-half">
              
                  <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Ciphers</label>
                      <div class="select is-fullwidth ">
                        <select class="">
                          <option>All</option>
                        </select>
                      </div>
                  </div>
              
              </div>

                <div class="column is-full">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">Server Cert</label>
                    <div class="control">
                      <textarea class="textarea cert-margin" rows="4"
                      placeholder=""
                      bind:value={Profile.cs_groups[row.index].server_cert}
                      />
                    </div>
                  </div>
                </div>

                <div class="column is-full">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">Server Key</label>
                    <div class="control">
                      <textarea class="textarea cert-margin" rows="4"
                      placeholder=""
                      bind:value={Profile.cs_groups[row.index].server_key}
                      />
                    </div>
                  </div>
                </div>

                <div class="column is-half">
                  <div class="field is-grouped">
                    <button class="button is-small is-danger is-outlined" 
                    disabled={Profile.isTransient || Profile.isRunning || (Profile.isLastCSG && Profile.cs_groups[row.index].fieldAttention!='mark-delete') }
                    on:click={onMarkUnmarkDelete (row.index)} >
                    {#if Profile.cs_groups[row.index].fieldAttention=='mark-delete'}
                      Unmark Delete
                    {:else}
                      Mark Delete
                    {/if}
                    </button> 
                  </div>
                </div>

                <div class="column is-full"></div>
              </div>
            </div>

            <div class="column is-2">
            </div>
          </div>
        </div>

        <div slot="cell" let:row let:cell>
          {#if cell.key == 'fieldAttention'}
            {#if cell.value == 'mark-delete'}
              <p><strong class="errmsg">x</strong></p>
            {:else if cell.value == 'field-update'}
              <p><strong class="errmsg">!</strong></p>
            {:else}
              <p><strong class="okmsg">&#10003;</strong></p>
            {/if}
          {:else}
            {cell.value}
          {/if}
        </div>

      </DataTable>
    </div>
    
    <div class="column is-12">

      <button class="button is-small is-info is-outlined" 
      disabled={Profile.isTransient || Profile.isRunning}
      on:click={onAddTrafficPath} >
      Add Traffic Path
      </button>      
      
    </div>

    <div class="column is-12">
    </div>

  </div>


  <style>
    .profile-margin {
      margin-top: 0px;
      margin-left: 1rem;
      margin-right: 1rem;
    }

    .my-border {
      border: 1px solid grey;
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 10px;
      padding-bottom: 15px;
    }

    .breadcrumb-margin {
        margin-top: 8px;
        margin-left: 1rem;
    }

    .errmsg {
      color: red;
    }

    .okmsg {
      color: green;
    }

    .cert-margin {
      padding-top: 0;
      padding-bottom: 0;
    }

    .start_stop_border {
      padding-top: 0.5rem;
    }

    .msg_border {
      margin-left: 0.6rem;
    }

</style>