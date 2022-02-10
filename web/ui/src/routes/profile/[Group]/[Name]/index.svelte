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

    // let Transactions;
    let transactionsError;
    let transactionsHelp;

    // let CPS;
    let cpsError;
    let cpsHelp;

    // let DataLength;
    let dataLengthError;
    let dataLengthHelp;

    // let MaxPipeline;
    let maxPipelineError;
    let maxPipelineHelp;

    // let ClientPort;
    let clientPortSelectHelp;
    let clientPortError;

    // let ServerPort;
    let serverPortSelectHelp;
    let serverPortError;

    function setState() {

      transactionsError = false;

      cpsError = false;

      dataLengthError = false;

      maxPipelineError = false;
  
      clientPortError = false;
      serverPortError = false;
    }

    import { createEventDispatcher, onMount, beforeUpdate } from "svelte";

    const dispatch = createEventDispatcher ();


    function validateTransactions () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.Transactions.trim() == ''){
        transactionsHelp = 'required';
        transactionsError = true;
      } else if (!numRegex.test(Profile.Transactions)){
        transactionsHelp = 'invalid - number only';
        transactionsError = true;
      } else if (Profile.Transactions != SavedProfile.Transactions){
        transactionsError = true;
        transactionsHelp = "modified"
      } else {
        transactionsError = false;
      }

      checkUnsaved();
    }
  
    function validateCps () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.CPS.trim() == ''){
        cpsHelp = 'required';
        cpsError = true;
      } else if (!numRegex.test(Profile.CPS)){
        cpsHelp = 'invalid - number only';
        cpsError = true;
      } else if (Profile.CPS != SavedProfile.CPS){
        cpsError = true;
        cpsHelp = "modified"
      } else {
        cpsError = false;
      }

      checkUnsaved();
    }

    function validateDataLength () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.DataLength.trim() == ''){
        dataLengthHelp = 'required';
        dataLengthError = true;
      } else if (!numRegex.test(Profile.DataLength)){
        dataLengthHelp = 'invalid - number only';
        dataLengthError = true;
      } else if (Profile.DataLength != SavedProfile.DataLength){
        dataLengthError = true;
        dataLengthHelp = "modified"
      } else {
        dataLengthError = false;
      }

      checkUnsaved();
    }

    function validateMaxPipeline () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.MaxPipeline.trim() == ''){
        maxPipelineHelp = 'required';
        maxPipelineError = true;
      } else if (!numRegex.test(Profile.MaxPipeline)){
        maxPipelineHelp = 'invalid - number only';
        maxPipelineError = true;
      } else if (Profile.MaxPipeline != SavedProfile.MaxPipeline){
        maxPipelineError = true;
        maxPipelineHelp = "modified"
      } else {
        maxPipelineError = false;
      }

      checkUnsaved();
    }

    function validateClientPort () {
      let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

      if (Profile.ClientPort.trim() == ''){
        clientPortSelectHelp = 'required';
        clientPortError = true;
      } else if (!numRegex.test(Profile.ClientPort)){
        clientPortSelectHelp = 'invalid - node:port';
        clientPortError = true;
      } else if (Profile.ClientPort != SavedProfile.ClientPort){
        clientPortError = true;
        clientPortSelectHelp = "modified"
      } else {
        clientPortError = false;
      }

      checkUnsaved();
    }

    function validateServerPort () {
      let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

      if (Profile.ServerPort.trim() == ''){
        serverPortSelectHelp = 'required';
        serverPortError = true;
      } else if (!numRegex.test(Profile.ServerPort)){
        serverPortSelectHelp = 'invalid - node:port';
        serverPortError = true;
      } else if (Profile.ServerPort != SavedProfile.ServerPort){
        serverPortError = true;
        serverPortSelectHelp = "modified"
      } else {
        serverPortError = false;
      }

      checkUnsaved();
    }

    function checkUnsaved() {
      markUnsaved = transactionsError 
                    || cpsError
                    || dataLengthError
                    || maxPipelineError
                    || clientPortError
                    || serverPortError;
    }

    function validateAllFields() {
      validateTransactions ();
      validateCps ();
      validateDataLength ();
      validateMaxPipeline ();
      validateClientPort ();
      validateServerPort ();
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
      {key: 'Group', value: 'Group'},
      {key: 'Client', value: 'Client'},
      {key: 'Server', value: 'Server'},
      {key: 'Protocol', value: 'Protocol'},
      {key: 'Port', value: 'Port'},
    ];

    const csGroupsData = [
      {id: 1,
        Group: 'Group1',
        Client: '12.51.0.0/16',
        Server: '12.61.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 2,
        Group: 'Group2',
        Client: '12.52.0.0/16',
        Server: '12.62.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 3,
        Group: 'Group3',
        Client: '12.53.0.0/16',
        Server: '12.63.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 4,
        Group: 'Group4',
        Client: '12.54.0.0/16',
        Server: '12.64.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 5,
        Group: 'Group5',
        Client: '12.55.0.0/16',
        Server: '12.65.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 6,
        Group: 'Group6',
        Client: '12.56.0.0/16',
        Server: '12.66.0.0/16',
        Protocol: 'SSL',
        Port: 443}
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
      <li class="is-active"><a> [ Duration: {Profile.Transactions / Profile.CPS} seconds ] [ <strong class="{markUnsaved ? 'errmsg' : ''}">{markUnsaved ? "Missing/Unsaved Fields" : ""}</strong> ] </a></li>
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
                      <input class="input {transactionsError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.Transactions}
                        on:input={validateTransactions}
                      >
                      {#if transactionsError}
                        <p class="help">{transactionsHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">CPS</label>
                    <div class="control">
                      <input class="input {cpsError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.CPS}
                        on:input={validateCps}
                      >
                      {#if cpsError}
                        <p class="help">{cpsHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>

                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">DataLength</label>
                    <div class="control">
                      <input class="input {dataLengthError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.DataLength}
                        on:input={validateDataLength}
                      >
                      {#if dataLengthError}
                        <p class="help">{dataLengthHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">MaxPipeline</label>
                    <div class="control">
                      <input class="input {maxPipelineError ? 'is-danger' : ''}" 
                        type="text" 
                        placeholder=""
                        bind:value={Profile.MaxPipeline}
                        on:input={validateMaxPipeline}
                      >
                      {#if maxPipelineError}
                        <p class="help">{maxPipelineHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>

                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">ClientPort</label>
                    <div class="control">
                      <input class="input {clientPortError ? 'is-danger' : ''}"
                        bind:value={Profile.ClientPort}
                        type="text"
                        placeholder=""
                        on:input={validateClientPort}
                      >
                      {#if clientPortError}
                      <p class="help">{clientPortSelectHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>
      
                <div class="column is-one-third">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">ServerPort</label>
                    <div class="control">
                      <input class="input {serverPortError ? 'is-danger' : ''}"
                        bind:value={Profile.ServerPort}
                        type="text"
                        placeholder=""
                        on:input={validateServerPort}
                      >
                      {#if serverPortError}
                      <p class="help">{serverPortSelectHelp}</p>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button  is-info" on:click={onSaveAndRun} >Save & Run</button>
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
            <label class="label ">CPS:</label>
          </div>
        </div>
        <div class="tile is-6 is-parent">
          <div class="tile is-child">
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
        rows={csGroupsData}
        size="medium"
        >
        <div slot="expanded-row" let:row>
          <div class="columns is-multiline is-mobile">
            <div class="column is-2">
            </div>

            <div class="column is-8">
              <div class="columns is-multiline is-mobile">
                <div class="column is-half">
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Client Subnet</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Client IPs</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Protocol</label>
                    <div class="select is-fullwidth is-small">
                      <select class="">
                        <option>TLS</option>
                        <option>TCP</option>
                      </select>
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">TLS Version</label>
                    <div class="select is-fullwidth is-small">
                      <select class="">
                        <option>All</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="column is-half">
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server Subnet</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server IP</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server Port</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Ciphers</label>
                    <div class="select is-fullwidth is-small">
                      <select class="">
                        <option>All</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server Cert</label>
                    <div class="control cert-key-height">
                      <textarea class="textarea cert-key-height" placeholder="input"></textarea>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server Key</label>
                    <div class="control cert-key-height">
                      <textarea class="textarea cert-key-height" placeholder="input"></textarea>
                    </div>
                  </div>
                </div>
                <div class="column is-half">
                  <div class="field is-grouped">
                    <div class="control">
                      <button class="button is-small is-info">Save</button>
                    </div>
                    <div class="control">
                      <button class="button is-small is-light">Cancel</button>
                    </div>
                  </div>
                  <br>
                </div>
              </div>
            </div>

            <div class="column is-2">
            </div>
          </div>
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

</style>