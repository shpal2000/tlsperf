<script>
  import { profileTreeRoot } from '$lib/store.js';
  import { selectedNode } from '$lib/store.js';
  import { routeViewState, getProfileStateKey } from '$lib/store';
  import {goto} from "$app/navigation";
  import Treenode from "$lib/Treenode.svelte";
  import AddProfileGroup from "$lib/AddProfileGroup.svelte";
  import AddProfile from "$lib/AddProfile.svelte";
  import RemoveProfile from "$lib/RemoveProfile.svelte";
  import ExportProfile from "$lib/ExportProfile.svelte";
  import RemoveProfileGroup from "$lib/RemoveProfileGroup.svelte";

  function onAddProfileGroup (event) {
    let profileGroupMenuItems = [{'Name': 'Add Profile ...', 'Event': 'addProfile', 'EventCtx': {}}, 
                              {'Name': 'Remove Folder ...', 'Event': 'removeProfileGroup', 'EventCtx': {}}];

    $profileTreeRoot.children.push({
                                  Name: event.detail.Name, 
                                  children: [],
                                  expanded: false,
                                  MenuItems: profileGroupMenuItems
                                });

    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = 'Traffic Profiles';
    $selectedNode.Type = 'ProfileGroup';

    $profileTreeRoot.expanded = true;

    $profileTreeRoot.children = $profileTreeRoot.children;
  }

  function onAddProfile (event) {
    let profileMenuItems = [{'Name': 'Export Profile ...', 'Event': 'exportProfile', 'EventCtx': {}},
                            {'Name': 'Remove Profile ...', 'Event': 'removeProfile', 'EventCtx': {}}];

    let profileGroup = $profileTreeRoot.children.find (pg => pg.Name==$selectedNode.Name);
    let urlPath = '/profile/'+profileGroup.Name+'/' + event.detail.Name

    profileGroup.children.push({
                              Name: event.detail.Name,
                              UrlPath: urlPath,
                              UrlPathView: urlPath,
                              MenuItems: profileMenuItems
                            });
    
    $selectedNode.Name = event.detail.Name;
    $selectedNode.ParentName = profileGroup.Name;
    $selectedNode.Type = 'Profile';

    profileGroup.expanded = true;

    $profileTreeRoot.children = $profileTreeRoot.children;

    goto(urlPath);
  }
  
  function onRemoveProfileGroup (event) {

    $profileTreeRoot.children = $profileTreeRoot.children.filter(pg => pg.Name != $selectedNode.Name);

    $selectedNode.Name = 'Traffic Profiles';

    $profileTreeRoot.children = $profileTreeRoot.children;
  }

  function onRemoveProfile (event) {
    
    const routeViewKey = getProfileStateKey($selectedNode.ParentName, $selectedNode.Name);

    if ($routeViewState[routeViewKey]){
      delete $routeViewState[routeViewKey];
    }

    let profileGroup = $profileTreeRoot.children.find (pg => pg.Name==$selectedNode.ParentName);

    profileGroup.children = profileGroup.children.filter(p => p.Name != $selectedNode.Name);

    $selectedNode.Name = profileGroup.Name;
    $selectedNode.ParentName = 'Traffic Profiles';
    $selectedNode.Type = 'ProfileGroup';

    $profileTreeRoot.children = $profileTreeRoot.children;

    goto('/deleted');
  }

  let showAddProfileGroup = false;
  let showAddProfile = false;
  let showRemoveProfileGroup = false;
  let showRemoveProfile = false;
  let showExportProfile = false;
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
          on:removeProfileGroup={() => showRemoveProfileGroup = true}
          />

          {#if child.expanded && child.children}
            {#each child.children as grandChild}
              <Treenode 
                node={grandChild}
                pnode={child}
                level={3} 
                type='Profile'
                on:removeProfile={() => showRemoveProfile = true}
                on:exportProfile={() => showExportProfile = true}/>
            {/each}
          {/if}

    {/each}
  {/if}
</ul> 

<AddProfileGroup bind:isActive={showAddProfileGroup} 
    on:addProfileGroupSuccess={onAddProfileGroup}/>

<AddProfile bind:isActive={showAddProfile} 
    on:addProfileSuccess={onAddProfile}/>

<RemoveProfileGroup bind:isActive={showRemoveProfileGroup} 
    on:removeProfileGroupSuccess={onRemoveProfileGroup}/>

<RemoveProfile bind:isActive={showRemoveProfile} 
    on:removeProfileSuccess={onRemoveProfile}/>

<ExportProfile bind:isActive={showExportProfile}/>

<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>