<script>
  import { profileTreeRoot } from './store.js';
  import Treenode from "./Treenode.svelte";

  let ProfilesMenuItems = ['New Profile ...'];
	let ProfileMenuItems = ['Clone Profile ...'];

	async function getProfiles() {
		const profiles = await fetch ('/api/profiles');

        if (profiles.ok) {
            const profileList = await profiles.json();
            
            $profileTreeRoot.MenuItems = ProfilesMenuItems;

            for (const profile of profileList) {
                $profileTreeRoot.children.push({Name: profile.Name, MenuItems: ProfileMenuItems, UrlPath: '/profile'});
            }
        }
        
        return 0;
	}

  let profilesPromise = getProfiles();

</script>


{#await profilesPromise}
  <p>Profiles waiting ...</p>
{:then}
  <ul>
    <Treenode 
      node={$profileTreeRoot} 
      level={1} 
      on:expandToggle={() => $profileTreeRoot.expanded = !$profileTreeRoot.expanded}
    />

    {#if $profileTreeRoot.expanded && $profileTreeRoot.children}
      {#each $profileTreeRoot.children as child}
          <Treenode node={child} level={2} />
      {/each}
    {/if}
  </ul> 
{/await}

<style>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>