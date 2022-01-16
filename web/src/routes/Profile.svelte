<script>
    import { profileTreeRoot } from '../store';
    import { selectedNode } from '../store.js';
    import Chart from 'chart.js/auto';
    import { onMount } from "svelte";
    import {replace} from "svelte-spa-router";
    import { DataTable } from "carbon-components-svelte";
    import "carbon-components-svelte/css/white.css";
    
    export let params = {};
    let activeTab = 'Config';

    let chartValues = [];
    let chartLabels = [];

    let chartCtxCps;
    let chartCanvasCps;
    let chartCps;

    let chartCtxThpt;
    let chartCanvasThpt;
    let chartThpt;
    
    let chartCtxLatency;
    let chartCanvasLatency;
    let chartLatency;
    
    
    let data = {
              labels: chartLabels,
              datasets: [{
                  label: '',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: chartValues
              }]
        };


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
        Port: 443}
    ];


    function onConfigClick(e) {
      activeTab='Config';
      replace ('/profile/' 
                + params.profileGroupName
                + '/' 
                + params.profileName
                + '/'
                + 'config');
    }

    function onStatsClick(e) {
      activeTab='Stats';
      replace ('/profile/' 
                + params.profileGroupName
                + '/' 
                + params.profileName
                + '/'
                + 'stats');
    }

    onMount ( () => {

        $selectedNode.ParentName = params.profileGroupName
        $selectedNode.Name = params.profileName
        $selectedNode.Type = 'Profile';

        if (params.anchor == 'stats'){
          activeTab = 'Stats';
        }


        console.log($profileTreeRoot.children);

        let profileGroup = $profileTreeRoot.children.find (pg => pg.Name==params.profileGroupName);

        console.log(profileGroup);
        profileGroup.expanded = true;

        $profileTreeRoot.expanded = true;
        $profileTreeRoot.children = $profileTreeRoot.children;


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

        chartCtxLatency = chartCanvasLatency.getContext('2d');
        chartLatency = new Chart(chartCtxLatency, {
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
        // const interval = setInterval(() => {
        //     fetch(`api/tlsfront_stats`)
        //             .then((response) => response.json())
        //             .then((results) => {
        //                 deployments = results;
        //                 data.labels = [...Array(10).keys()];
        //                 data.datasets= Object.keys(deployments).map(k => ({
        //                                 label: k,
        //                                 fill: true,
        //                                 borderColor: "#ffa700",
        //                                 backgroundColor: "#fafad2",
        //                                 data: deployments[k].sum.map(v => v.tlsfrontThroughput)
        //                               }));
        //                 chartCps.update();
        //             });
        // }, 1000);
        // return () => {
        //   clearInterval(interval);
        // };

  
    });

</script>

<!-- <nav class="breadcrumb is-left breadcrumb-margin" aria-label="breadcrumbs">
  <ul>
    <li class="is-active" ><a>Profile</a></li>
    <li class="is-active" ><a>{params.profileGroupName}</a></li>
    <li class="is-active" ><a>{params.profileName}</a></li>
  </ul>
</nav> -->

<!-- <div class="tabs is-left main-margin is-boxed">
  <ul>
    <li class="{activeTab=='Config' ? 'is-active' : ''}" on:click={onConfigClick}>
      <a>
        <span>Config</span>
      </a>
    </li>
    <li class="{activeTab=='Stats' ? 'is-active' : ''}" on:click={onStatsClick}>
        <a>
          <span>Stats</span>
        </a>
    </li>
  </ul>
</div> -->

<div class="container profile-content profile-content-margin">
  {#if activeTab=='Config'}
    <div class="columns is-multiline is-mobile">
      <div class="column is-1"></div>
      <div class="column is-10">
        <div class="tile is-ancestor is-mobile">
          <div class="tile is-6 is-parent">
            <div class="tile is-child my-border">
              <section>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-half">
                    <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Total Transactions</label>
                      <div class="control">
                        <input class="input " type="text" placeholder="Text input">
                      </div>
                    </div>
                  </div>
        
                  <div class="column is-half">
                    <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Data Bytes</label>
                      <div class="control">
                        <input class="input " type="text" placeholder="Text input">
                      </div>
                    </div>
                  </div>
                  <br>
                  <div class="column is-half">
                    <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">CPS</label>
                      <div class="control">
                        <input class="input " type="text" placeholder="Text input">
                      </div>
                    </div>
                  </div>
        
                  <div class="column is-half">
                    <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Max Pipeline</label>
                      <div class="control">
                        <input class="input " type="text" placeholder="Text input">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field is-grouped">
                  <div class="control">
                    <button class="button  is-info">Run</button>
                  </div>
                  <div class="control">
                    <button class="button  is-light">Save</button>
                  </div>
                </div>
              </section> 

            </div>
          </div>
          <div class="tile is-6 is-parent">

            <div class="tile is-child my-border">
              <canvas bind:this={chartCanvasCps} id="cpsChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-1"></div>

      <div class="column is-1"></div>
      <div class="column is-10">
        <div class="tile is-ancestor is-mobile">
          <div class="tile is-6 is-parent">
            <div class="tile is-child my-border">
              <canvas bind:this={chartCanvasThpt} id="thptChart"></canvas>
            </div>
          </div>
          <div class="tile is-6 is-parent">
            <div class="tile is-child my-border">
              <canvas bind:this={chartCanvasLatency} id="latencyChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-1"></div>

      <div class="column is-1"></div>
      <div class="column is-10">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label ">Traffic Paths:</label>
        <DataTable
          expandable
          headers={csGroupHeaders}
          rows={csGroupsData}
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
      <div class="column is-1"></div>
    </div>
  {:else}
    <div class="columns is-multiline is-mobile">
      <div class="column is-1"></div>
      <div class="column is-10">
        <p>stats</p>
      </div>
      <div class="column is-1"></div>
    </div>
  {/if}
</div>



<style>
    .breadcrumb-margin {
      margin-top: 8px;
      margin-left: 2.5rem;
    }

    .my-border {
      border: 1px solid lightgrey;
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 10px;
      padding-bottom: 15px;
    }

    .main-margin {
      margin-top: 4px;
      margin-right: 1.6rem;
      margin-left: 1.6rem;
    }

    .profile-content-margin {
      margin-top: 2rem;
    }

</style>