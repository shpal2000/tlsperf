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
<p>
    <!-- Profile - {profileUrlPath.trim().split('/')[1]}
    <br/>
    ProfileGroup - {profileUrlPath.trim().split('/')[0]} -->
</p>