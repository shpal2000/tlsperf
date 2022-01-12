<script>
    import { profileTreeRoot } from '../store';
    import { selectedNode } from '../store.js';

    import { onMount } from "svelte";
    
    export let profileUrlPath;


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

<style>
    .mymargin {
        margin-top: 0.5rem;
    }
</style>


<!-- <p>
    Profile - {profileUrlPath.trim().split('/')[1]}
    <br/>
    ProfileGroup - {profileUrlPath.trim().split('/')[0]}
</p> -->
<nav class="breadcrumb has-succeeds-separator mymargin is-right" aria-label="breadcrumbs">
  <ul>
    <li class="is-active"><a href="#">Traffic Profiles</a></li>
    <li class="is-active"><a href="#">abc</a></li>
    <li class="is-active"><a href="#">sdfasd</a></li>
  </ul>
</nav>

    <div class="tabs is-boxed is-left">
        <ul>
          <li class="is-active">
            <a>
              <span>Config</span>
            </a>
          </li>
          <li>
            <a>
              <span>Run</span>
            </a>
          </li>
          <li>
            <a>
              <span>Results</span>
            </a>
          </li>
        </ul>
      </div>
