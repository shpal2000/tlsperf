<script>
    import { nodeTreeRoot } from '../store';
    import { selectedNode } from '../store.js';

    import { onMount } from "svelte";
    
    export let params = {};


    onMount ( () => {

        $selectedNode.ParentName = params.nodeGroupName;
        $selectedNode.Name = params.nodeName;
        $selectedNode.Type = 'Node';


        console.log($nodeTreeRoot.children);

        let nodeGroup = $nodeTreeRoot.children.find (ng => ng.Name==params.nodeGroupName);

        console.log(nodeGroup);
        nodeGroup.expanded = true;

        $nodeTreeRoot.expanded = true;
        $nodeTreeRoot.children = $nodeTreeRoot.children;
    });

</script>
<p>
    Node - {params.nodeName}
    <br/>
    NodeGroup - {params.nodeGroupName}
</p>