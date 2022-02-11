<script>
    import { page } from '$app/stores'
    import { routeViewState } from '$lib/store';

    import { DataTable } from "carbon-components-svelte";
    import "carbon-components-svelte/css/white.css";
    import { ProgressBar } from "carbon-components-svelte";
    import Chart from 'chart.js/auto';

    let markUnsaved
    let Profile = null;
    let SavedProfile = null;


    import { createEventDispatcher, onMount, beforeUpdate } from "svelte";

    const dispatch = createEventDispatcher ();

    function validateClientIPs (csg_index) {
      let numRegex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/([1-2][0-9]?|3[0-2]?|[4-9])$', );
      
      const csg = Profile.cs_groups[csg_index];
      const savedCsg = SavedProfile.cs_groups[csg_index];

      if (csg.client_ips.trim() == ''){
        csg.client_ipsHelp = 'required';
        csg.client_ipsError = true;
      } else if (!(csg.client_ips.match(numRegex) && csg.client_ips.match(numRegex)[0] === csg.client_ips)) {
        csg.client_ipsHelp = 'invalid - ip/cidr';
        csg.client_ipsError = true;
      } else if (csg.client_ips != savedCsg.client_ips) {
        csg.client_ipsError = true;
        csg.client_ipsHelp = "modified"
      } else {
        csg.client_ipsError = false;
      }
      
      checkUnsaved();

      Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
    }

    function validateTransactions () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.Transactions.trim() == ''){
        Profile.transactionsHelp = 'required';
        Profile.transactionsError = true;
      } else if (!(Profile.Transactions.match(numRegex) && Profile.Transactions.match(numRegex)[0] === Profile.Transactions)){
        Profile.transactionsHelp = 'invalid - number only';
        Profile.transactionsError = true;
      } else if (Profile.Transactions != SavedProfile.Transactions){
        Profile.transactionsError = true;
        Profile.transactionsHelp = "modified"
      } else {
        Profile.transactionsError = false;
      }

      checkUnsaved();
    }
  
    function validateCps () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.CPS.trim() == ''){
        Profile.cpsHelp = 'required';
        Profile.cpsError = true;
      } else if (!(Profile.CPS.match(numRegex) && Profile.CPS.match(numRegex)[0] === Profile.CPS)){
        Profile.cpsHelp = 'invalid - number only';
        Profile.cpsError = true;
      } else if (Profile.CPS != SavedProfile.CPS){
        Profile.cpsError = true;
        Profile.cpsHelp = "modified"
      } else {
        Profile.cpsError = false;
      }

      checkUnsaved();
    }

    function validateDataLength () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.DataLength.trim() == ''){
        Profile.dataLengthHelp = 'required';
        Profile.dataLengthError = true;
      } else if (!(Profile.DataLength.match(numRegex) && Profile.DataLength.match(numRegex)[0] === Profile.DataLength)){
        Profile.dataLengthHelp = 'invalid - number only';
        Profile.dataLengthError = true;
      } else if (Profile.DataLength != SavedProfile.DataLength){
        Profile.dataLengthError = true;
        Profile.dataLengthHelp = "modified"
      } else {
        Profile.dataLengthError = false;
      }

      checkUnsaved();
    }

    function validateMaxPipeline () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.MaxPipeline.trim() == ''){
        Profile.maxPipelineHelp = 'required';
        Profile.maxPipelineError = true;
      } else if (!(Profile.MaxPipeline.match(numRegex) && Profile.MaxPipeline.match(numRegex)[0] === Profile.MaxPipeline)){
        Profile.maxPipelineHelp = 'invalid - number only';
        Profile.maxPipelineError = true;
      } else if (Profile.MaxPipeline != SavedProfile.MaxPipeline){
        Profile.maxPipelineError = true;
        Profile.maxPipelineHelp = "modified"
      } else {
        Profile.maxPipelineError = false;
      }

      checkUnsaved();
    }

    function validateClientIface () {
      let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

      if (Profile.ClientIface.trim() == ''){
        Profile.clientIfaceHelp = 'required';
        Profile.clientIfaceError = true;
      } else if (!(Profile.ClientIface.match(numRegex) && Profile.ClientIface.match(numRegex)[0] === Profile.ClientIface)){
        Profile.clientIfaceHelp = 'invalid - node:port';
        Profile.clientIfaceError = true;
      } else if (Profile.ClientIface != SavedProfile.ClientIface){
        Profile.clientIfaceError = true;
        Profile.clientIfaceHelp = "modified"
      } else {
        Profile.clientIfaceError = false;
      }

      checkUnsaved();
    }

    function validateServerIface () {
      let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

      if (Profile.ServerIface.trim() == ''){
        Profile.serverIfaceHelp = 'required';
        Profile.serverIfaceError = true;
      } else if (!(Profile.ServerIface.match(numRegex) && Profile.ServerIface.match(numRegex)[0] === Profile.ServerIface)){
        Profile.serverIfaceHelp = 'invalid - node:port';
        Profile.serverIfaceError = true;
      } else if (Profile.ServerIface != SavedProfile.ServerIface){
        Profile.serverIfaceError = true;
        Profile.serverIfaceHelp = "modified"
      } else {
        Profile.serverIfaceError = false;
      }

      checkUnsaved();
    }

    function checkUnsaved() {
      markUnsaved = Profile.transactionsError 
                    || Profile.cpsError
                    || Profile.dataLengthError
                    || Profile.maxPipelineError
                    || Profile.clientIfaceError
                    || Profile.serverIfaceError;

      for (const csg of Profile.cs_groups) {
        csg.fieldError = false;
        if (csg.client_ipsError) {
          markUnsaved = true;
          csg.fieldError = true;
          break;
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

    function onCommon () {

      validateAllFields ();

      checkUnsaved ();

      return !markUnsaved;
    }

    async function onSave () {
      if (onCommon()){
        // controller = new AbortController();
        // signal = controller.signal;
      }
    }

    async function onSaveAndRun () {
      if (onCommon()){
        // controller = new AbortController();
        // signal = controller.signal;
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

    let chartCtxCps;
    let chartCanvasCps;
    let chartCps;

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
      {key: 'fieldError', value: ''}
    ];

    const statsHeaders = [
      {key: 'Name', value: 'Name'},
      {key: 'Client', value: 'Client'},
      {key: 'Server', value: 'Server'},
    ];

    const statsData = [
      {id: 1,
        Name: 'TcpConnInit',
        Client: 100,
        Server: 0},

        {id: 2,
        Name: 'TcpEstablished',
        Client: 100,
        Server: 100},

        {id: 3,
        Name: 'SslConnInit',
        Client: 100,
        Server: 0},

        {id: 4,
        Name: 'SslEstablished',
        Client: 100,
        Server: 100},

        {id: 5,
        Name: 'ActiveConn',
        Client: 1,
        Server: 1},

        {id: 6,
        Name: 'ResetRcvd',
        Client: 1,
        Server: 1}
    ];


  beforeUpdate ( () => {

    const routeViewKey = 'profile/'+$page.stuff.Profile.Group + '/' + $page.stuff.Profile.Name;

    if (Profile 
            && Profile.Group == $page.stuff.Profile.Group
            && Profile.Name == $page.stuff.Profile.Name) {

      //skip updating Profile; as this is case of field update

    } else {

      if ($routeViewState[routeViewKey]) {
        Profile = $routeViewState[routeViewKey].Profile;
        SavedProfile = $routeViewState[routeViewKey].SavedProfile;

      } else {
        Profile = JSON.parse(JSON.stringify($page.stuff.Profile));
        
        //all number field to string
        Profile.Transactions = Profile.Transactions.toString();
        Profile.CPS = Profile.CPS.toString();
        Profile.DataLength = Profile.DataLength.toString();
        Profile.MaxPipeline = Profile.MaxPipeline.toString();

        for (const csg of Profile.cs_groups) {
          csg.id = csg.app_id;
          csg.err_status = false;
          csg.client_ips = csg.client_ips.join(',')
        }

        SavedProfile = JSON.parse(JSON.stringify(Profile));

        $routeViewState[routeViewKey] = {Profile, SavedProfile};
      }

      validateAllFields ();

    }

    // markUnsaved = JSON.stringify(Profile) != JSON.stringify(SavedProfile);

  });

  onMount ( () => {
    
    chartCtxCps = chartCanvasCps.getContext('2d');
    chartCps = new Chart(chartCtxCps, {
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



</script>

<nav class="breadcrumb is-left breadcrumb-margin" aria-label="breadcrumbs">
  <ul>
      <!-- svelte-ignore a11y-missing-attribute -->
      <li class="is-active" ><a>Profile</a></li>

      <!-- svelte-ignore a11y-missing-attribute -->
      <li class="is-active" ><a>{Profile.Group}</a></li>

      <!-- svelte-ignore a11y-missing-attribute -->
      <li class="is-active" ><a>{Profile.Type} : {Profile.Name}</a></li>

      <!-- svelte-ignore a11y-missing-attribute -->
      <li class="is-active"><a> [ Duration: {Profile.Transactions / Profile.CPS} seconds ] [<strong class="{markUnsaved ? 'errmsg' : ''}">{markUnsaved ? " Missing/Unsaved Fields " : ""}</strong> ] </a></li>
  </ul>
</nav>

<div class="columns is-multiline is-mobile profile-margin">
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
                      <input class="input {Profile.transactionsError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.Transactions}
                        on:input={validateTransactions}
                      >
                      {#if Profile.transactionsError}
                        <p class="help">{Profile.transactionsHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">CPS</label>
                    <div class="control">
                      <input class="input {Profile.cpsError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.CPS}
                        on:input={validateCps}
                      >
                      {#if Profile.cpsError}
                        <p class="help">{Profile.cpsHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>

                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">DataLength</label>
                    <div class="control">
                      <input class="input {Profile.dataLengthError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.DataLength}
                        on:input={validateDataLength}
                      >
                      {#if Profile.dataLengthError}
                        <p class="help">{Profile.dataLengthHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">MaxPipeline</label>
                    <div class="control">
                      <input class="input {Profile.maxPipelineError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.MaxPipeline}
                        on:input={validateMaxPipeline}
                      >
                      {#if Profile.maxPipelineError}
                        <p class="help">{Profile.maxPipelineHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>

                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">ClientPort</label>
                    <div class="control">
                      <input class="input {Profile.clientIfaceError ? 'is-danger' : ''}"
                        bind:value={Profile.ClientIface}
                        type="text"
                        placeholder=""
                        on:input={validateClientIface}
                      >
                      {#if Profile.clientIfaceError}
                      <p class="help">{Profile.clientIfaceHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">ServerPort</label>
                    <div class="control">
                      <input class="input {Profile.serverIfaceError ? 'is-danger' : ''}"
                        bind:value={Profile.ServerIface}
                        type="text"
                        placeholder=""
                        on:input={validateServerIface}
                      >
                      {#if Profile.serverIfaceError}
                      <p class="help">{Profile.serverIfaceHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button  is-info" on:click={onSaveAndRun} >Run</button>
                </div>
                <div class="control">
                  <button class="button  is-info is-outlined" on:click={onSave} >Save</button>
                </div>
              </div>
            </section> 

          </div>
        </div>
        <div class="tile is-6 is-parent">

          <div class="tile is-child my-border">
            <DataTable
            size="short"
            headers={statsHeaders}
            rows={statsData}
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
            <canvas bind:this={chartCanvasCps} id="cpsChart"></canvas>
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
                      <input class="input {Profile.cs_groups[row.index].client_ipsError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.cs_groups[row.index].client_ips}
                        on:input={() => validateClientIPs(row.index)}
                      >
                      {#if Profile.cs_groups[row.index].client_ipsError}
                        <p class="help">{Profile.cs_groups[row.index].client_ipsHelp}</p>
                      {/if}
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
          {#if cell.key == 'fieldError'}
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