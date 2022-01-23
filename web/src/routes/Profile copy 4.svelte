<script>
    import { profileTreeRoot } from '../store';
    import { selectedNode } from '../store.js';
    import CsGroups from '../CsGroups.svelte';
    import Chart from 'chart.js/auto';
    import { onMount } from "svelte";
    import {replace} from "svelte-spa-router";
    
    export let params = {};

    let activeTab = 'Config';

    let cs_groups = [{}];

    let chartValues = [];
    let chartLabels = [];

    let chartCtxCps;
    let chartCanvasCps;
    let chartCps;

    let chartCtxThpt;
    let chartCanvasThpt;
    let chartThpt;
    
    let data = {
              labels: chartLabels,
              datasets: [{
                  label: '',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: chartValues
              }]
        };


    function onConfigClick(e) {
      activeTab='Config';
      replace ('/#/profile/' 
                + params.profileGroupName
                + '/' 
                + params.profileName
                + '/'
                + 'config');
    }

    function onStatsClick(e) {
      activeTab='Stats';
      replace ('/#/profile/' 
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
              animation :{
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

<nav class="breadcrumb is-left breadcrumb-margin" aria-label="breadcrumbs">
  <ul>
    <li class="is-active" ><a>Profile</a></li>
    <li class="is-active" ><a>{params.profileGroupName}</a></li>
    <li class="is-active" ><a>{params.profileName}</a></li>
  </ul>
</nav>

<div class="tabs is-left main-margin is-boxed">
  <ul>
    <li class="{activeTab=='Config' ? 'is-active' : ''}">
      <!-- svelte-ignore a11y-missing-attribute -->
      <a>
        <span on:click={onConfigClick}>Config</span>
      </a>
    </li>
    <li class="{activeTab=='Stats' ? 'is-active' : ''}">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a>
          <span on:click={onStatsClick}>Stats</span>
        </a>
    </li>
  </ul>
</div>

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
                      <label class="label ">Name</label>
                      <div class="control">
                        <input class="input " type="text" placeholder="Text input">
                      </div>
                    </div>
                  </div>
        
                  <div class="column is-half">
                    <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Type</label>
                      <div class="select is-fullwidth ">
                        <select class="">
                          <option>Select Type</option>
                          <option>TLS Client, TLS Server</option>
                          <option>TLS Client Only</option>
                          <option>TLS Server Only</option>
                          <option>TCP Client, TCP Server</option>
                          <option>TCP Client Only</option>
                          <option>TCP Server Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <br>
                  <div class="column is-half">
                    <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Client Port</label>
                      <div class="select is-fullwidth ">
                        <select class="">
                          <option>Select Port</option>
                          <option>G1:N1:ens192</option>
                          <option>G1:N1:ens224</option>
                        </select>
                      </div>
                    </div>
                  </div>
        
                  <div class="column is-half">
                    <div class="field">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <label class="label ">Server Port</label>
                      <div class="select is-fullwidth ">
                        <select class="">
                          <option>Select Port</option>
                          <option>G1:N1:ens192</option>
                          <option>G1:N1:ens224</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field is-grouped">
                  <div class="control">
                    <button class="button  is-info">Run</button>
                  </div>
                  <div class="control">
                    <button class="button  is-light">Stop</button>
                  </div>
                </div>
              </section> 

            </div>
          </div>
          <div class="tile is-6 is-parent">

            <div class="tile is-child my-border">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <!-- <label class="label  has-text-white">~/log$ </label> -->
              <canvas bind:this={chartCanvasCps} id="cpsChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-1"></div>

      <div class="column is-1"></div>
      <div class="column is-10">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label ">Traffic Paths:</label>
        <CsGroups bind:cs_groups={cs_groups}/>
      </div>
      <div class="column is-1"></div>
    </div>
  {:else}
    stats
  {/if}
</div>



<style>
    .breadcrumb-margin {
      margin-top: 4px;
      margin-left: 1.6rem;
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