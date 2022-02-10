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

    function validateClientIPs (Csg, savedCsg) {
      let numRegex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/[1-2][0-9]?|3[0-2]?$', );

      console.log (Csg);
      console.log (savedCsg);

      console.log (numRegex.test(Csg.client_ips));
      
      if (Csg.client_ips.trim() == ''){
        Csg.client_ipsHelp = 'required';
        Csg.client_ipsError = true;
      } else if (!numRegex.test(Csg.client_ips)){
        Csg.client_ipsHelp = 'invalid - ip/cidr';
        Csg.client_ipsError = true;
      } else if (Csg.client_ips != savedCsg.client_ips){
        Csg.client_ipsError = true;
        Csg.client_ipsHelp = "modified"
      } else {
        Csg.client_ipsError = false;
      }

      checkUnsaved();
    }

    function validateTransactions () {
      let numRegex = new RegExp('^[0-9]+$', 'i');

      if (Profile.Transactions.trim() == ''){
        Profile.transactionsHelp = 'required';
        Profile.transactionsError = true;
      } else if (!numRegex.test(Profile.Transactions)){
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
      } else if (!numRegex.test(Profile.CPS)){
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
      } else if (!numRegex.test(Profile.DataLength)){
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
      } else if (!numRegex.test(Profile.MaxPipeline)){
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
      } else if (!numRegex.test(Profile.ClientIface)){
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
      } else if (!numRegex.test(Profile.ServerIface)){
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
        validateClientIPs (Profile.cs_groups[i], SavedProfile.cs_groups[i])
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
                    <label class="label ">ClientIface</label>
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
                    <label class="label ">ServerIface</label>
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
                        on:input={() => validateClientIPs(Profile.cs_groups[row.index], SavedProfile.cs_groups[row.index])}
                      >
                      {#if Profile.cs_groups[row.index].client_ipsError}
                        <p class="help">{Profile.cs_groups[row.index].client_ipsHelp}</p>
                      {/if}
                    </div>
                  </div>

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
                    <label class="label ">Server IP</label>
                    <div class="control">
                      <input class="input " 
                      type="text" 
                      placeholder=""
                      bind:value={Profile.cs_groups[row.index].server_ip}
                      >
                    </div>
                  </div>

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

    .cert-margin {
      padding-top: 0;
      padding-bottom: 0;
    }

</style>