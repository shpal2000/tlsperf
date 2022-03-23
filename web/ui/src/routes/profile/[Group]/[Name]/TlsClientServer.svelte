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
    import { ProgressBar, Loading, TextInput, FormGroup, Select, SelectItem, Grid, Row, Column} from "carbon-components-svelte";
    import Chart from 'chart.js/auto';

    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text';

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


    function validateServerIP (csg_index) {
      let numRegex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/([1-2][0-9]?|3[0-2]?|[4-9])$', );
      
      const csg = Profile.cs_groups[csg_index];
      const savedCsg = SavedProfile.cs_groups[csg_index];

      csg.server_ipError = false;
      csg.server_ipUnsaved = false;
      csg.server_ipHelp = ''

      if (csg.server_ip.trim() == ''){
        csg.server_ipHelp = 'required';
        csg.server_ipError = true;
      } else if (!(csg.server_ip.match(numRegex) && csg.server_ip.match(numRegex)[0] === csg.server_ip)) {
        csg.server_ipHelp = 'invalid - ip/cidr';
        csg.server_ipError = true;
      } else if (csg.server_ip != savedCsg.server_ip) {
        csg.server_ipUnsaved = true;
        csg.server_ipHelp = "modified"
      }
      
      checkFields();

      Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
    }

    function validateServerPort (csg_index) {
      let numRegex = new RegExp('^[0-9]+$', 'i');
      
      const csg = Profile.cs_groups[csg_index];
      const savedCsg = SavedProfile.cs_groups[csg_index];

      csg.server_portError = false;
      csg.server_portUnsaved = false;
      csg.server_portHelp = ''

      if (csg.server_port.trim() == ''){
        csg.server_portHelp = 'required';
        csg.server_portError = true;
      } else if (!(csg.server_port.match(numRegex) && csg.server_port.match(numRegex)[0] === csg.server_port)) {
        csg.server_portHelp = 'invalid - ip/cidr';
        csg.server_portError = true;
      } else if (csg.server_port != savedCsg.server_port) {
        csg.server_portUnsaved = true;
        csg.server_portHelp = "modified"
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

    function validateClientIface (csg_index) {
      let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

      const csg = Profile.cs_groups[csg_index];
      const savedCsg = SavedProfile.cs_groups[csg_index];

      csg.client_ifaceError = false;
      csg.client_ifaceUnsaved = false;
      csg.client_ifaceHelp = ''

      if (csg.client_iface.trim() == ''){
        csg.client_ifaceHelp = 'required';
        csg.client_ifaceError = true;
      } else if (!(csg.client_iface.match(numRegex) && csg.client_iface.match(numRegex)[0] === csg.client_iface)) {
        csg.client_ifaceHelp = 'invalid - iface';
        csg.client_ifaceError = true;
      } else if (csg.client_iface != savedCsg.client_iface) {
        csg.client_ifaceUnsaved = true;
        csg.client_ifaceHelp = "modified"
      }
      
      checkFields();

      Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
    }

    function validateServerIface (csg_index) {
      let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

      const csg = Profile.cs_groups[csg_index];
      const savedCsg = SavedProfile.cs_groups[csg_index];

      csg.server_ifaceError = false;
      csg.server_ifaceUnsaved = false;
      csg.server_ifaceHelp = ''

      if (csg.server_iface.trim() == ''){
        csg.server_ifaceHelp = 'required';
        csg.server_ifaceError = true;
      } else if (!(csg.server_iface.match(numRegex) && csg.server_iface.match(numRegex)[0] === csg.server_iface)) {
        csg.server_ifaceHelp = 'invalid - iface';
        csg.server_ifaceError = true;
      } else if (csg.server_iface != savedCsg.server_iface) {
        csg.server_ifaceUnsaved = true;
        csg.server_ifaceHelp = "modified"
      }
      
      checkFields();

      Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
    }

    function validateProtocol (csg_index) {
      const csg = Profile.cs_groups[csg_index];
      const savedCsg = SavedProfile.cs_groups[csg_index];
      
      if (csg.server_ssl === savedCsg.server_ssl) {
        csg.server_sslUnsaved = false;
        csg.server_sslHelp = "";
      } else {
        csg.server_sslUnsaved = true;
        csg.server_sslHelp = "modified";
      }

      checkFields();

      Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
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
        if (csg.fieldAttention == 'mark-delete' 
              || csg.fieldAttention == 'new-csg') {
          Profile.markUnsavedFields = true;
          continue;
        }

        csg.fieldAttention = '';
        if (csg.client_ipsError
            || csg.client_ifaceError
            || csg.server_ifaceError
            || csg.server_ipError
            || csg.server_portError
            ) 
        {
          Profile.markErrorFields = true;
          csg.fieldAttention = 'field-update';
        }

        if (csg.client_ipsUnsaved
            || csg.client_ifaceUnsaved
            || csg.server_ifaceUnsaved
            || csg.server_ipUnsaved
            || csg.server_portUnsaved
            )
        {
          Profile.markUnsavedFields = true;
          csg.fieldAttention = 'field-update';
        }
      }

      checkLastCSG ();
    }

    function validateAllFields() {
      validateTransactions ();
      validateCps ();
      // validateDataLength ();
      // validateMaxPipeline ();


      for (let i=0; i < Profile.cs_groups.length; i++) {
        validateClientIface (i);
        validateServerIface (i);
        
        validateClientIPs (i);
        validateServerIP (i);
        validateServerPort (i);

        validateProtocol (i);
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
        const res = await fetch ('/api/profile_tcpdump.pcap', {
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
              Profile.isCapturing = 1;
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
        const res = await fetch ('/api/profile_tcpdump.pcap', {
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
              Profile.isCapturing = 0;
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
              const csg2 = JSON.parse(JSON.stringify(csg));

              csgCanonical (csg);

              csg.fieldAttention = 'new-csg';

              Profile.cs_groups.push (csg);
              Profile.cs_groups = [...Profile.cs_groups];

              SavedProfile.cs_groups.push (csg2);
              SavedProfile.cs_groups = [...SavedProfile.cs_groups];

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
          // await onStopCapture();
        }
      } else {
        if (Profile.markUnsavedFields || Profile.markErrorFields) {
          await onSave();
        } else {
          // await onStartCapture();
          await onStart();
        }
      }
    }

    async function onCaptureAction () {
      if (Profile.isCapturing) {
        // await onStopCapture();
      } else {
        // await onStartCapture();
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

  function csgCanonical (csg) {

    csg.id = csg.app_id;

    csg.client_ifaceError = false;
    csg.client_ifaceUnsaved = false;
    csg.client_ifaceHelp = ''

    csg.server_ifaceError = false;
    csg.server_ifaceUnsaved = false;
    csg.server_ifaceHelp = ''


    csg.client_ips = csg.client_ips.join(',');
    csg.client_ipsError = false;
    csg.client_ipsUnsaved = false;
    csg.client_ipsHelp = ''

    csg.server_ipError = false;
    csg.server_ipUnsaved = false;
    csg.server_ipHelp = '';

    csg.server_port = csg.server_port.toString();
    csg.server_portError = false;
    csg.server_portUnsaved = false;
    csg.server_portHelp = '';

    
    if (csg.server_ssl == 0) {
      csg.server_ssl = 'TCP';
    } else {
      csg.server_ssl = 'SSL';
    }
    csg.server_sslError = false;
    csg.server_sslUnsaved = false;
    csg.server_sslHelp = '';

    csg.client_tls_versionError = false;
    csg.client_tls_versionUnsaved = false;
    csg.client_tls_versionHelp = '';

    csg.server_tls_versionError = false;
    csg.server_tls_versionUnsaved = false;
    csg.server_tls_versionHelp = '';

    csg.client_tls_cipherError = false;
    csg.client_tls_cipherUnsaved = false;
    csg.client_tls_cipherHelp = '';

    csg.server_tls_cipherError = false;
    csg.server_tls_cipherUnsaved = false;
    csg.server_tls_cipherHelp = '';

    csg.client_tcp_close_typeError = false;
    csg.client_tcp_close_typeUnsaved = false;
    csg.client_tcp_close_typeHelp = '';

    csg.server_tcp_close_typeError = false;
    csg.server_tcp_close_typeUnsaved = false;
    csg.server_tcp_close_typeHelp = '';

    csg.client_tls_close_typeError = false;
    csg.client_tls_close_typeUnsaved = false;
    csg.client_tls_close_typeHelp = '';

    csg.server_tls_close_typeError = false;
    csg.server_tls_close_typeUnsaved = false;
    csg.server_tls_close_typeHelp = '';

    csg.client_resumption_count = csg.client_resumption_count.toString();
    csg.client_resumption_countError = false;
    csg.client_resumption_countUnsaved = false;
    csg.client_resumption_countHelp = '';

    csg.server_resumption_count = csg.server_resumption_count.toString();
    csg.server_resumption_countError = false;
    csg.server_resumption_countUnsaved = false;
    csg.server_resumption_countHelp = '';

    csg.client_resumption_typeError = false;
    csg.client_resumption_typeUnsaved = false;
    csg.client_resumption_typeHelp = '';

    csg.server_resumption_typeError = false;
    csg.server_resumption_typeUnsaved = false;
    csg.server_resumption_typeHelp = '';

    csg.max_active_conn_count = csg.max_active_conn_count.toString();
    csg.max_active_conn_countError = false;
    csg.max_active_conn_countUnsaved = false;
    csg.max_active_conn_countHelp = '';

    csg.cs_data_len = csg.cs_data_len.toString();
    csg.cs_data_lenError = false;
    csg.cs_data_lenUnsaved = false;
    csg.cs_data_lenHelp = '';

    csg.sc_data_len = csg.sc_data_len.toString();
    csg.sc_data_lenError = false;
    csg.sc_data_lenUnsaved = false;
    csg.sc_data_lenHelp = '';

    csg.cs_starttls_len = csg.cs_starttls_len.toString();
    csg.cs_starttls_lenError = false;
    csg.cs_starttls_lenUnsaved = false;
    csg.cs_starttls_lenHelp = '';

    csg.sc_starttls_len = csg.sc_starttls_len.toString();
    csg.sc_starttls_lenError = false;
    csg.sc_starttls_lenUnsaved = false;
    csg.sc_starttls_lenHelp = '';

    csg.client_tcp_rcv_buff_len = csg.client_tcp_rcv_buff_len.toString();
    csg.client_tcp_rcv_buff_lenError = false;
    csg.client_tcp_rcv_buff_lenUnsaved = false;
    csg.client_tcp_rcv_buff_lenHelp = '';

    csg.server_tcp_rcv_buff_len = csg.server_tcp_rcv_buff_len.toString();
    csg.server_tcp_rcv_buff_lenError = false;
    csg.server_tcp_rcv_buff_lenUnsaved = false;
    csg.server_tcp_rcv_buff_lenHelp = '';

    csg.client_tcp_snd_buff_len = csg.client_tcp_snd_buff_len.toString();
    csg.client_tcp_snd_buff_lenError = false;
    csg.client_tcp_snd_buff_lenUnsaved = false;
    csg.client_tcp_snd_buff_lenHelp = '';

    csg.server_tcp_snd_buff_len = csg.server_tcp_snd_buff_len.toString();
    csg.server_tcp_snd_buff_lenError = false;
    csg.server_tcp_snd_buff_lenUnsaved = false;
    csg.server_tcp_snd_buff_lenHelp = '';

    csg.client_read_chunk_len = csg.client_read_chunk_len.toString();
    csg.client_read_chunk_lenError = false;
    csg.client_read_chunk_lenUnsaved = false;
    csg.client_read_chunk_lenHelp = '';

    csg.server_read_chunk_len = csg.server_read_chunk_len.toString();
    csg.server_read_chunk_lenError = false;
    csg.server_read_chunk_lenUnsaved = false;
    csg.server_read_chunk_lenHelp = '';

    csg.client_write_chunk_len = csg.client_write_chunk_len.toString();
    csg.client_write_chunk_lenError = false;
    csg.client_write_chunk_lenUnsaved = false;
    csg.client_write_chunk_lenHelp = '';

    csg.server_write_chunk_len = csg.server_write_chunk_len.toString();
    csg.server_write_chunk_lenError = false;
    csg.server_write_chunk_lenUnsaved = false;
    csg.server_write_chunk_lenHelp = '';
  }

  function profileCanonical (p) {

    const p2 = JSON.parse(JSON.stringify(p));

    p2.Transactions = p2.Transactions.toString();
    p2.CPS = p2.CPS.toString();
    
    //for table header and row
    for (const csg of p2.cs_groups) {
      csgCanonical (csg);
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

      csg2.app_id = "CSG" + csg_index.toString();
      csg2.app_gid = csg.app_gid;

      csg2.client_iface = csg.client_iface;
      csg2.server_iface = csg.server_iface;

      csg2.client_ips = csg.client_ips.split(',');
      csg2.server_ip = csg.server_ip;

      csg2.server_port = parseInt(csg.server_port);

      if (csg.server_ssl == 'TCP') {
        csg2.server_ssl = 0;
      } else {
        csg2.server_ssl = 1;
      }

      csg2.server_key = csg.server_key;
      csg2.server_cert = csg.server_cert;

      csg2.client_tls_version = csg.client_tls_version;
      csg2.server_tls_version = csg.server_tls_version;

      csg2.client_tls_cipher = csg.client_tls_cipher;
      csg2.server_tls_cipher = csg.server_tls_cipher;

      csg2.client_tcp_close_type = csg.client_tcp_close_type;
      csg2.server_tcp_close_type = csg.server_tcp_close_type;

      csg2.client_tls_close_type = csg.client_tls_close_type;
      csg2.server_tls_close_type = csg.server_tls_close_type;

      csg2.client_resumption_count = parseInt(csg.client_resumption_count);
      csg2.server_resumption_count = parseInt(csg.server_resumption_count);

      csg2.client_resumption_type = csg.client_resumption_type;
      csg2.server_resumption_type = csg.server_resumption_type;

      csg2.max_active_conn_count = parseInt(csg.max_active_conn_count);

      csg2.client_tcp_rcv_buff_len = parseInt(csg.client_tcp_rcv_buff_len);
      csg2.server_tcp_rcv_buff_len = parseInt(csg.server_tcp_rcv_buff_len);

      csg2.client_tcp_snd_buff_len = parseInt(csg.client_tcp_snd_buff_len);
      csg2.server_tcp_snd_buff_len = parseInt(csg.server_tcp_snd_buff_len);

      csg2.client_read_chunk_len = parseInt(csg.client_read_chunk_len);
      csg2.server_read_chunk_len = parseInt(csg.server_read_chunk_len);

      csg2.client_write_chunk_len = parseInt(csg.client_write_chunk_len);
      csg2.server_write_chunk_len = parseInt(csg.server_write_chunk_len);

      csg2.cs_data_len = parseInt(csg.cs_data_len);
      csg2.sc_data_len = parseInt(csg.sc_data_len);
      csg2.cs_starttls_len = parseInt(csg.cs_starttls_len);
      csg2.sc_starttls_len = parseInt(csg.sc_starttls_len);
      
      csg2.cps = Math.floor (p2.CPS / csg_count); 
      csg2.total_conn_count = Math.floor (p2.Transactions / csg_count);

      p2.cs_groups.push (csg2);
    }

    if (p2.CPS % csg_count) {
      let cpsReminder = p2.CPS % csg_count;
      while (cpsReminder > 0) {
        for (const csg2 of p2.cs_groups) {

          csg2.cps += 1;
          cpsReminder -= 1;

          if (cpsReminder == 0) {
            break;
          }
        }
      }
    }


    if (p2.Transactions % csg_count) {
      let transactionReminder = p2.Transactions % csg_count;
      while (transactionReminder > 0) {
        for (const csg2 of p2.cs_groups) {
          
          csg2.total_conn_count += 1;
          transactionReminder -= 1;

          if (transactionReminder == 0) {
            break;
          }
        }
      }
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
    borderWidth: 1.5,
    lineTension: 0.1,
    borderColor: 'rgb(255, 116, 65)',
    data: []
  },
  {
    fill: false,
    borderWidth: 1.5,
    lineTension: 0.1,
    borderColor: 'rgb(255, 116, 65)',
    data: []
  },
  {
    fill: false,
    borderWidth: 1.5,
    lineTension: 0.1,
    borderColor: 'rgb(255, 116, 65)',
    data: []
  },
  {
    fill: false,
    borderWidth: 1.5,
    lineTension: 0.1,
    borderColor: 'rgb(255, 116, 65)',
    data: []
  }];


  let clntThptChartDataSet = [{
    fill: true,
    borderWidth: 1.5,
    lineTension: 0.1,
    borderColor: 'rgb(255, 116, 65)',
    data: []
  },
  {
    fill: false,
    borderWidth: 1.5,
    lineTension: 0.1,
    borderColor: 'rgb(255, 116, 65)',
    data: []
  },
  {
    fill: false,
    borderWidth: 1.5,
    lineTension: 0.1,
    borderColor: 'rgb(255, 116, 65)',
    data: []
  }];

  let srvrThptChartDataSet = [{
    fill: true,
    borderWidth: 1.5,
    lineTension: 0.1,
    borderColor: 'rgb(255, 116, 65)',
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
                
                
                <div class="column is-full">
                  <TextInput inline size="sm" bind:value={Profile.Transactions} 
                  labelText="Sessions"
                  invalidText= "{Profile.transactionsHelp}"
                  invalid={(Profile.transactionsError || Profile.transactionsUnsaved)}
                  readonly={Profile.isTransient || Profile.isRunning}
                  on:keyup={validateTransactions} />
                </div>

                <div class="column is-full">
                    <TextInput inline size="sm" bind:value={Profile.CPS} 
                    labelText="CPS"
                      invalid={(Profile.cpsError || Profile.cpsUnsaved)}
                      invalidText="{Profile.cpsHelp}"
                      readonly={Profile.isTransient || Profile.isRunning}
                      on:keyup={validateCps}/>
                </div>          
                
                <div class="column is-full">
                  <div class="field has-text-centered">
                    <div class="control has-text-centered" >
                      <button class="button {Profile.isRunning ? 'is-danger is-light' : 'is-dark'}" 
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
    
                      <!-- <button class="button is-light is-dark" 
                        disabled={Profile.isTransient || (!Profile.isRunning)}
                        on:click={onCaptureAction} > 
                          {#if Profile.isCapturing}
                            Stop Capture
                          {:else}
                            Start Capture
                          {/if}
                      </button> -->
                    </div>
                  </div>
                </div>


              </div>
            </section> 

          </div>
        </div>

        <div class="tile is-4 is-parent">
          <div class="tile is-child my-border">
            <DataTable
            size="compact"
            headers={topStatsHeaders}
            rows={Profile.connStats}
            zebra
            />
          </div>
        </div>

        <div class="tile is-4 is-parent">
          <div class="tile is-child my-border">
            <DataTable
            size="compact"
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
            <div class="column">
            </div>

            <div class="column is-three-fifths">
              <br>
              <FormGroup legendText="Traffic Ports">
                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_iface} 
                labelText="Client"
                invalidText= "{Profile.cs_groups[row.index].client_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].client_ifaceError || Profile.cs_groups[row.index].client_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateClientIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />                  
              </FormGroup>

              <FormGroup legendText="IP, Ports">
                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_ips} 
                labelText="Client IPs"
                invalidText= "{Profile.cs_groups[row.index].client_ipsHelp}"
                invalid={(Profile.cs_groups[row.index].client_ipsError || Profile.cs_groups[row.index].client_ipsUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateClientIPs (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_ip} 
                labelText="Server IP"
                invalidText= "{Profile.cs_groups[row.index].server_ipHelp}"
                invalid={(Profile.cs_groups[row.index].server_ipError || Profile.cs_groups[row.index].server_ipUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIP (row.index)} />   

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_port} 
                labelText="Server Port"
                invalidText= "{Profile.cs_groups[row.index].server_portHelp}"
                invalid={(Profile.cs_groups[row.index].server_portError || Profile.cs_groups[row.index].server_portUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerPort (row.index)} />   
              </FormGroup>

              <FormGroup legendText="TCP Options">
                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Client Close"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />   

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Client RcvBuffer"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server RcvBuffer"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />   
              </FormGroup>

              <FormGroup legendText="TLS Options">
                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_iface} 
                labelText="Client Version"
                invalidText= "{Profile.cs_groups[row.index].client_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].client_ifaceError || Profile.cs_groups[row.index].client_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateClientIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_iface} 
                labelText="Server Version"
                invalidText= "{Profile.cs_groups[row.index].client_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].client_ifaceError || Profile.cs_groups[row.index].client_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateClientIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Client Ciphers"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server Ciphers"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Client Resumption"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server Resumption"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Client CloseNotify"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} /> 

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server CloseNotify"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} /> 

              </FormGroup>

              <FormGroup legendText="App Options">
                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_iface} 
                labelText="Client DataLen"
                invalidText= "{Profile.cs_groups[row.index].client_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].client_ifaceError || Profile.cs_groups[row.index].client_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateClientIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server DataLen"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_iface} 
                labelText="Client StartTls"
                invalidText= "{Profile.cs_groups[row.index].client_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].client_ifaceError || Profile.cs_groups[row.index].client_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateClientIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server StartTls"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_iface} 
                labelText="Client ReadChunk"
                invalidText= "{Profile.cs_groups[row.index].client_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].client_ifaceError || Profile.cs_groups[row.index].client_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateClientIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server ReadChunk"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />                  

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_iface} 
                labelText="Client WriteChunk"
                invalidText= "{Profile.cs_groups[row.index].client_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].client_ifaceError || Profile.cs_groups[row.index].client_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateClientIface (row.index)} />

                <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Server WriteChunk"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />                  

                <!-- <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
                labelText="Emulation"
                invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
                invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={() => validateServerIface (row.index)} />                   -->

              </FormGroup>

            </div>

            <div class="column">
            </div>
          </div>
        </div>

        <div slot="cell" let:row let:cell>
          {#if cell.key == 'fieldAttention'}
            {#if cell.value == 'mark-delete'}
              <p><strong class="errmsg">x</strong></p>
            {:else if cell.value == 'field-update'}
              <p><strong class="errmsg">!</strong></p>
            {:else if cell.value == 'new-csg'}
              <p><strong class="errmsg">*</strong></p>
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
      margin-left: 4rem;
      margin-right: 4rem;
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

    .start_stop_border {
      padding-top: 0.5rem;
    }

</style>