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
<nav class="breadcrumb has-succeeds-separator is-left breadcrumb-margin" aria-label="breadcrumbs">
  <ul>
    <li class="is-active"><a href="#">Traffic Profiles</a></li>
    <li class="is-active"><a href="#">abc</a></li>
    <li class="is-active"><a href="#">sdfasd</a></li>
  </ul>
</nav>


<div class="container profile-content">
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
                  <button class="button is-small is-info">Run</button>
                </div>
                <div class="control">
                  <button class="button is-small is-light">Stop</button>
                </div>
              </div>
            </section> 

          </div>
        </div>
        <div class="tile is-6 is-parent">

          <div class="tile is-child my-border">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label is-small">~/log$ </label>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-1"></div>

    <div class="column is-1"></div>
    <div class="column is-10">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label is-small">Traffic Paths:</label>
      <CsGroups bind:cs_groups={cs_groups}/>
    </div>
    <div class="column is-1"></div>
  </div>

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
</style>