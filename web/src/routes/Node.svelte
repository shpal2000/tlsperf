<script>
    import { nodeTreeRoot } from '../store';
    import { selectedNode } from '../store.js';

    import { onMount } from "svelte";
    
    export let nodeUrlPath;


    onMount ( () => {
        const nodeUrlPathSplit = nodeUrlPath.trim().split('/');

        $selectedNode.ParentName = nodeUrlPathSplit[0];
        $selectedNode.Name = nodeUrlPathSplit[1];
        $selectedNode.Type = 'Node';


        console.log($nodeTreeRoot.children);

        let nodeGroup = $nodeTreeRoot.children.find (ng => ng.Name==nodeUrlPathSplit[0]);

        console.log(nodeGroup);
        nodeGroup.expanded = true;

        $nodeTreeRoot.expanded = true;
        $nodeTreeRoot.children = $nodeTreeRoot.children;
    });

</script>
<p>
    Node - {nodeUrlPath.trim().split('/')[1]}
    <br/>
    NodeGroup - {nodeUrlPath.trim().split('/')[0]}
</p>