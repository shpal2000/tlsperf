<script>
  import { profileTreeRoot } from './store.js';
  import { selectedNode } from './store.js';
  import { navigate } from "svelte-routing";
  import Treenode from "./Treenode.svelte";
  import AddProfileGroup from "./AddProfileGroup.svelte";
  import AddProfile from "./AddProfile.svelte";

  function onAddProfileGroupSuccess (event) {
    let groupMenuItems = [{'Name': 'Add Profile ...', 'Event': 'addProfile', 'EventCtx': {}}];

    $profileTreeRoot.children.push({
                                  Name: event.detail.Name, 
                                  children: [],
                                  expanded: false,
                                  MenuItems: groupMenuItems
                                });

    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = 'Traffic Profiles';
    $selectedNode.Type = 'ProfileGroup';

    $profileTreeRoot.expanded = true;

    $profileTreeRoot.children = $profileTreeRoot.children;
  }

  function onAddProfileSuccess (event) {

    let profileGroup = $profileTreeRoot.children.find (pg => pg.Name==$selectedNode.Name);
    let urlPath = '/profile/'+profileGroup.Name+'/' + event.detail.Name

    profileGroup.children.push({
                              Name: event.detail.Name,
                              UrlPath: urlPath
                            });
    
    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = profileGroup.Name;
    $selectedNode.Type = 'Profile';

    profileGroup.expanded = true;

    $profileTreeRoot.children = $profileTreeRoot.children;

    navigate(urlPath, {replace: true});
  }
  
  let showAddProfileGroup = false;
  let showAddProfile = false;
</script>



<ul>
  <Treenode 
    node={$profileTreeRoot}
    pnode={$profileTreeRoot}
    level={1}
    type='ProfileTreeRoot'
    on:expandToggle={() => $profileTreeRoot.expanded = !$profileTreeRoot.expanded}
    on:addProfileGroup={() => showAddProfileGroup = true}
  />

  {#if $profileTreeRoot.expanded && $profileTreeRoot.children}
    {#each $profileTreeRoot.children as child}
        <Treenode 
          node={child}
          pnode={$profileTreeRoot}
          level={2}
          type='ProfileGroup'
          on:expandToggle={() => child.expanded = !child.expanded}
          on:addProfile={() => showAddProfile = true}
          />

          {#if child.expanded && child.children}
            {#each child.children as grandChild}
              <Treenode node={grandChild} pnode={child} level={3} type='Profile'/>
            {/each}
          {/if}

    {/each}
  {/if}
</ul> 

<AddProfileGroup bind:isActive={showAddProfileGroup} 
    on:addProfileGroupSuccess={onAddProfileGroupSuccess}/>

<AddProfile bind:isActive={showAddProfile} 
    on:addProfileSuccess={onAddProfileSuccess}/>
  
<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>