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
        csg.fieldAttention = false;
        if (csg.client_ipsError) {
          Profile.markErrorFields = true;
          csg.fieldAttention = true;
        }
        if (csg.client_ipsUnsaved) {
          Profile.markUnsavedFields = true;
          csg.fieldAttention = true;
        }
      }
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
      stopTimerTick();

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

              const topStats = Profile.topStats;
              const topStatsSaved = SavedProfile.topStats;

              Profile = profileCanonical(p);
              SavedProfile = profileCanonical(p);

              Profile.topStats = topStats;
              SavedProfile.topStats = topStatsSaved;

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

      startTimerTick();
    }

    async function onStop () {
      Profile.isTransient = true;
      stopTimerTick();


      let action = 'onStop';

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

      startTimerTick();
    }
    
    function getTopStats () {
      return JSON.parse (JSON.stringify ([
        {id: 1,
          Name: 'TcpConnInit',
          Client: 0,
          Server: 0},

          {id: 2,
          Name: 'TcpEstablished',
          Client: 0,
          Server: 0},

          {id: 3,
          Name: 'SslConnInit',
          Client: 0,
          Server: 0},

          {id: 4,
          Name: 'SslEstablished',
          Client: 0,
          Server: 0},

          {id: 5,
          Name: 'ActiveConn',
          Client: 0,
          Server: 0},

          {id: 6,
          Name: 'Tcp/SslConnInitFail',
          Client: 0,
          Server: 0}
        ]));
    }

    function getCpsChartData () {
      return JSON.parse (JSON.stringify ([
        {
          "labels:" : ['CPsInit', 'CpsSucc', 'CpsAccept'],
          "datasets" : [0, 0, 0]
        }
        ]));
    }


    function clearStats () {
      Profile.topStats = getTopStats();
      Profile.cpsChartData = getCpsChartData ();

      SavedProfile.topStats = getTopStats();
      SavedProfile.cpsChartData = getCpsChartData ();
    }

    async function onStart () {
      Profile.isTransient = true;
      stopTimerTick();

      clearStats ();

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

      startTimerTick();
    }

    async function onAction () {
      if (Profile.isRunning) {
        await onStop();
      } else {
        if (Profile.markUnsavedFields || Profile.markErrorFields) {
          await onSave();
        } else {
          await onStart();
        }
      }
    }

    let chartValues = [];
    let chartLabels = [];

    let data = {
              labels: chartLabels,
              datasets: [{
                  label: '',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: chartValues
              }]
        };

    let cpsChartCtx;
    let cpsChartCanvas;
    let cpsChart;

    let chartCtxThpt;
    let chartCanvasThpt;
    let chartThpt;

    let chartCtxLatency;
    let chartCanvasLatency;
    let chartLatency;

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
      {key: 'Server', value: 'Server'},
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
      csg.err_status = false;
      csg.client_ips = csg.client_ips.join(',')
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


    p2.cs_groups = [];
    let csg_index = 0;
    for (const csg of p.cs_groups) {
      const csg2 = {};

      csg2.index = csg_index;
      csg_index += 1;

      csg2.client_ips = csg.client_ips.split(',');
      csg2.server_ip = csg.server_ip;

      csg2.app_id = csg.app_id;
        
      csg2.app_gid = csg.app_gid;

      csg2.server_port = csg.server_port;
      csg2.server_ssl = csg.server_ssl;
      csg2.send_recv_len = csg.send_recv_len;
      csg2.cps = Math.floor (p2.CPS / p.cs_groups.length); 
      csg2.max_active_conn_count = Math.floor (p2.MaxPipeline / p.cs_groups.length);
      csg2.total_conn_count = Math.floor (p2.Transactions / p.cs_groups.length);
      csg2.server_key = csg.server_key
      csg2.server_cert = csg.server_cert

      p2.cs_groups.push (csg2);
    }

    return p2;
  }

    let Profile = null;
    let SavedProfile = null;

    let NextSyncTick;
    let SyncTickCount;
    let NextStatsTick;
    let StatsTickCount;

    function initTimerTicks() {
      if (isLoading) {
        NextSyncTick = 5;
        SyncTickCount = 0;
        NextStatsTick = 5;
        StatsTickCount = 0;
      } else {
        NextSyncTick = 15;
        SyncTickCount = 0;
        NextStatsTick = 5;
        StatsTickCount = 0;
      }
    }

    initTimerTicks();

    let TimerTick = null;

    function stopTimerTick () {
      if (!TimerTick) {
          clearTimeout (TimerTick);
          TimerTick = null;
      }
    }

    function startTimerTick() {
      TimerTick = setTimeout ( onTimerTick, 1000);
    }

    async function onTimerTick() {
      stopTimerTick ();

      SyncTickCount += 1;
      StatsTickCount += 1;

      if (SyncTickCount == NextSyncTick) {
        SyncTickCount = 0;

        onSyncInterval ();
      } 
      
      if (StatsTickCount == NextStatsTick) {
        StatsTickCount = 0;

        onStatsInterval ();
      }



      if (isLoading 
          && (SyncTickCount == 0) 
          && (StatsTickCount == 0) ) {

        await tick();

        isLoading = false;
        initTimerTicks ();
      }

      startTimerTick();
    }

  async function onStatsInterval () {

    try{
      const res = await fetch (`/api/stats.json?group=${Profile.Group}&name=${Profile.Name}`);
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
          if (json.status == 0) {

            Profile.Stats =json.data;

            if (Profile.Stats.TlsClient.sum.tcpConnInit >=0 
                && Profile.Stats.TlsServer.sum.tcpConnInit >= 0) {
              
              Profile.topStats[0].Server = 0;
              Profile.topStats[1].Server = Profile.Stats.TlsServer.sum.tcpAcceptSuccess;
              Profile.topStats[2].Server = 0;
              Profile.topStats[3].Server = Profile.Stats.TlsServer.sum.sslAcceptSuccess;
              Profile.topStats[4].Server = Profile.Stats.TlsServer.sum.tcpActiveConns;
              Profile.topStats[5].Server = 0;

              Profile.topStats[0].Client = Profile.Stats.TlsClient.sum.tcpConnInit;
              Profile.topStats[1].Client = Profile.Stats.TlsClient.sum.tcpConnInitSuccess;
              Profile.topStats[2].Client = Profile.Stats.TlsClient.sum.sslConnInit;
              Profile.topStats[3].Client = Profile.Stats.TlsClient.sum.sslConnInitSuccess;
              Profile.topStats[4].Client = Profile.Stats.TlsClient.sum.tcpActiveConns;
              Profile.topStats[5].Client = Profile.Stats.TlsClient.sum.tcpConnInitFail + Profile.Stats.TlsClient.sum.sslConnInitFail;
            
              cpsChartDataSet.data = [
                Profile.Stats.TlsClient.sum.tcpConnInitRate,
                Profile.Stats.TlsClient.sum.tcpConnInitSuccessRate,
                Profile.Stats.TlsServer.sum.tcpAcceptSuccessRate,
                Profile.Stats.TlsClient.sum.sslConnInitRate,
                Profile.Stats.TlsClient.sum.sslConnInitSuccessRate,
                Profile.Stats.TlsServer.sum.sslAcceptSuccessRate
              ];

              cpsChart.update();
            }
          } else {
          }
        } else {
        }
      }
    } catch (e) {
    }
  }
 
  async function onSyncInterval () {

    try{
      const res = await fetch (`/api/profile_runs.json?group=${Profile.Group}&name=${Profile.Name}`);
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
          if (json.status == 0) {

            await tick ();

            const task =json.data;
            Profile.isRunning = (task.State == 'run');
            Profile.isProgress = (task.Status == 'progress');
            Profile.progressText = task.Events.length ? task.Events[task.Events.length-1] : Profile.progressText;

            Profile.isTransient = false;
          } else {
          }
        } else {
        }
      }
    } catch (e) {
    }
  }
  
  beforeUpdate ( async () => {

    const routeViewKey = getProfileStateKey ($page.stuff.Profile.Group, $page.stuff.Profile.Name);

    if (Profile 
            && Profile.Group == $page.stuff.Profile.Group
            && Profile.Name == $page.stuff.Profile.Name) {

      //skip updating Profile; as this is case of field update

    } else {
      stopTimerTick();
      
      isLoading = true;
      initTimerTicks ();

      if ($routeViewState[routeViewKey]) {
        Profile = $routeViewState[routeViewKey].Profile;
        SavedProfile = $routeViewState[routeViewKey].SavedProfile;

        clearStats ();
        validateAllFields ();
      } else {

        Profile = profileCanonical ($page.stuff.Profile);
        SavedProfile = profileCanonical ($page.stuff.Profile);

        $routeViewState[routeViewKey] = {Profile, SavedProfile};

        clearStats ();
        validateAllFields ();
        
      }

      startTimerTick();
    }
  });

  // afterUpdate ( async () => {
    
  // })


  let cpsChartDataSet = [{
            barPercentage: 0.6,
            borderColor: 'rgb(8, 141, 165)',
            backgroundColor: 'rgb(8, 141, 165)',
            data: [120, 100, 90, 120, 100, 90]
          }]

  onMount ( () => {
    
    cpsChartCtx = cpsChartCanvas.getContext('2d');
    cpsChart = new Chart(cpsChartCtx, {
        type: 'bar',
        data: {
          labels: ['tcpInit', 'tcpSucc', 'tcpAccept', 'sslInit', 'sslSucc', 'sslAccept'],
          datasets: cpsChartDataSet
        }
        ,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: false
          }
        }
    });

    chartCtxThpt = chartCanvasThpt.getContext('2d');
    chartThpt = new Chart(chartCtxThpt, {
        type: 'line',
        data: data,
        options: {
          animation:{
            duration: 0
          },

          interaction: {
            intersect: false
          },

          plugins: {
            legend: false
          },

          scales: {
            x: {
              type: 'linear'
            }
          }
        }
    });

  //   chartCtxLatency = chartCanvasLatency.getContext('2d');
  //   chartLatency = new Chart(chartCtxLatency, {
  //       type: 'line',
  //       data: data,
  //       options: {
  //         animation:{
  //           duration: 0
  //         },

  //         interaction: {
  //           intersect: false
  //         },

  //         plugins: {
  //           legend: false
  //         },

  //         scales: {
  //           x: {
  //             type: 'linear'
  //           }
  //         }
  //       }
  //   });
  });

  onDestroy ( () => {
    stopTimerTick ();
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
      <li class="is-active"><a> [ Duration: {Profile.Transactions / Profile.CPS} seconds ] <strong class="{Profile.markUnsavedFields || Profile.markErrorFields ? 'errmsg' : ''}">&nbsp;&nbsp;{Profile.markUnsavedFields ? "Unsaved Fields" : ""} &nbsp;&nbsp;{Profile.markErrorFields ? "Error Fields" : ""}</strong> </a></li>
  </ul>
</nav>

<div class="columns is-multiline is-mobile profile-margin">

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
        <div class="tile is-6 is-parent">
          <div class="tile is-child my-border">
            <section>
              <div class="columns is-multiline is-mobile">
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">Transactions</label>
                    <div class="control">
                      <input class="input {(Profile.transactionsError || Profile.transactionsUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.Transactions}
                        on:input={validateTransactions}
                      >
                      <p class="help">{Profile.transactionsHelp}</p>
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">CPS</label>
                    <div class="control">
                      <input class="input {(Profile.cpsError || Profile.cpsUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.CPS}
                        on:input={validateCps}
                      >
                      <p class="help">{Profile.cpsHelp}</p>
                    </div>
                  </div>
                </div>

                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">DataLength</label>
                    <div class="control">
                      <input class="input {(Profile.dataLengthError || Profile.dataLengthUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.DataLength}
                        on:input={validateDataLength}
                      >
                      <p class="help">{Profile.dataLengthHelp}</p>
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">MaxPipeline</label>
                    <div class="control">
                      <input class="input {(Profile.maxPipelineError || Profile.maxPipelineUnsaved) ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        bind:value={Profile.MaxPipeline}
                        on:input={validateMaxPipeline}
                      >
                      <p class="help">{Profile.maxPipelineHelp}</p>
                    </div>
                  </div>
                </div>

                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">ClientPort</label>
                    <div class="control">
                      <input class="input {(Profile.clientIfaceError || Profile.clientIfaceUnsaved) ? 'is-danger' : ''}"
                        bind:value={Profile.ClientIface}
                        type=""
                        placeholder=""
                        readonly={Profile.isTransient || Profile.isRunning}
                        on:input={validateClientIface}
                      >
                      <p class="help">{Profile.clientIfaceHelp}</p>
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
                      <p class="help">{Profile.serverIfaceHelp}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field is-grouped">
                <div class="control" >
                  <button class="button  is-info" 
                    disabled={Profile.isTransient || (!Profile.isRunning && Profile.markErrorFields)}
                    on:click={onAction} > 
                      {#if Profile.isRunning}
                        Stop
                      {:else}
                        {#if Profile.markUnsavedFields || Profile.markErrorFields}
                          Save
                        {:else}
                          Start
                        {/if} 
                      {/if}
                  </button>
                </div>
              </div>
            </section> 

          </div>
        </div>
        <div class="tile is-6 is-parent">

          <div class="tile is-child my-border">
            <DataTable
            size="short"
            headers={topStatsHeaders}
            rows={Profile.topStats}
            zebra
            />
          </div>
        </div>
      </div>
    </div>

    <div class="column is-12">
      <div class="tile is-ancestor is-mobile">
        <div class="tile is-6 is-parent">
          <div class="tile is-child">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label ">CPS:</label>
          </div>
        </div>
        <div class="tile is-6 is-parent">
          <div class="tile is-child">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label ">Throughput:</label>
          </div>
        </div>
      </div>
    </div>

    <div class="column is-12">
      <div class="tile is-ancestor is-mobile">
        <div class="tile is-6 is-parent">
          <div class="tile is-child my-border">
            <canvas bind:this={cpsChartCanvas} id="cpsChart"></canvas>
          </div>
        </div>
        <div class="tile is-6 is-parent">
          <div class="tile is-child my-border">
            <canvas bind:this={chartCanvasThpt} id="thptChart"></canvas>
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
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-2">
            </div>
          </div>
        </div>

        <div slot="cell" let:row let:cell>
          {#if cell.key == 'fieldAttention'}
            {#if cell.value}
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
    
  </div>


  <style>
    .profile-margin {
      margin-top: 0px;
      margin-left: 5rem;
      margin-right: 5rem;
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
        margin-left: 1.25rem;
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

</style>