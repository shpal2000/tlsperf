<script>
    import { profileTreeRoot } from '../store';
    import { selectedNode } from '../store.js';
    import CsGroups from '../CsGroups.svelte';

    import { onMount } from "svelte";
    
    export let profileUrlPath;
    let cs_groups = [{}];


    onMount ( () => {
        const profileUrlPathSplit = profileUrlPath.trim().split('/');

        $selectedNode.ParentName = profileUrlPathSplit[0];
        $selectedNode.Name = profileUrlPathSplit[1];
        $selectedNode.Type = 'Profile';


        console.log($profileTreeRoot.children);

        let profileGroup = $profileTreeRoot.children.find (ng => ng.Name==profileUrlPathSplit[0]);

        console.log(profileGroup);
        profileGroup.expanded = true;

        $profileTreeRoot.expanded = true;
        $profileTreeRoot.children = $profileTreeRoot.children;
    });

</script>

<!-- <p>
    Profile - {profileUrlPath.trim().split('/')[1]}
    <br/>
    ProfileGroup - {profileUrlPath.trim().split('/')[0]}
</p> -->
<nav class="breadcrumb has-succeeds-separator is-left main-margin" aria-label="breadcrumbs">
  <ul>
    <li class="is-active"><a href="#">Traffic Profiles</a></li>
    <li class="is-active"><a href="#">abc</a></li>
    <li class="is-active"><a href="#">sdfasd</a></li>
  </ul>
</nav>

<!-- <div class="tabs is-left main-margin is-boxed">
  <ul>
    <li class="is-active">
      <a>
        <span>Traffic</span>
      </a>
    </li>
    <li class="inactive-background">
      <a>
        <span>Results</span>
      </a>
    </li>
    <li class="inactive-background">
      <a>
        <span>Trend</span>
      </a>
    </li>
  </ul>
</div> -->

<div class="container profile-content">
  <div class="columns">
    <div class="column"></div>

    <div class="column is-10">
      <div class="columns is-multiline is-mobile">
        <div class="column is-half">

          <section class="my-border">
            <div class="columns is-multiline is-mobile">
              <div class="column is-half">
                <div class="field">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="label is-small">Name</label>
                  <div class="control">
                    <input class="input is-small" type="text" placeholder="Text input">
                  </div>
                </div>
              </div>
    
              <div class="column is-half">
                <div class="field">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="label is-small">Type</label>
                  <div class="select is-fullwidth is-small">
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
                  <label class="label is-small">Client Port</label>
                  <div class="select is-fullwidth is-small">
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
                  <label class="label is-small">Server Port</label>
                  <div class="select is-fullwidth is-small">
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
                <button class="button is-small is-info" on:click={onAddProfileSuccess}>Add</button>
              </div>
              <div class="control">
                <button class="button is-small is-light" on:click={() => isActive=false}>Cancel</button>
              </div>
            </div>
          </section>          

        </div>
        <div class="column is-half">

          <section class="my-border">
            <div class="columns is-multiline is-mobile">
              <div class="column is-half">
                <div class="field">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="label is-small">Name</label>
                  <div class="control">
                    <input class="input is-small" type="text" placeholder="Text input">
                  </div>
                </div>
              </div>
    
              <div class="column is-half">
                <div class="field">
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label class="label is-small">Type</label>
                  <div class="select is-fullwidth is-small">
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
                  <label class="label is-small">Client Port</label>
                  <div class="select is-fullwidth is-small">
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
                  <label class="label is-small">Server Port</label>
                  <div class="select is-fullwidth is-small">
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
                <button class="button is-small is-info" on:click={onAddProfileSuccess}>Add</button>
              </div>
              <div class="control">
                <button class="button is-small is-light" on:click={() => isActive=false}>Cancel</button>
              </div>
            </div>
          </section>  

        </div>
        <div class="column auto">
          <CsGroups bind:cs_groups={cs_groups}/>
        </div>
      </div>
    </div>
    <div class="column"></div>
  </div>

</div>



<style>
    .main-margin {
      margin-top: 1.6rem;
      margin-right: 1.6rem;
      margin-left: 1.6rem;
    }
    .inactive-background {
      background-color: whitesmoke;
    }
    .my-border {
      border: 1px solid lightgrey;
      padding: 25px;
    }
</style>