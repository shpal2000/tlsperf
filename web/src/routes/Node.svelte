<script>
    import { nodeTreeRoot } from '../store';
    import { selectedNode } from '../store.js';

    import { onMount } from "svelte";
    
    export let nodeInfo;


    onMount ( () => {
        const nodeInfoList = nodeInfo.trim().split('/');

        $selectedNode.ParentName = nodeInfoList[0];
        $selectedNode.Name = nodeInfoList[1];
        $selectedNode.Type = 'Node';


        console.log($nodeTreeRoot.children);

        let nodeGroup = $nodeTreeRoot.children.find (ng => ng.Name==nodeInfoList[0]);

        console.log(nodeGroup);
        nodeGroup.expanded = true;

        $nodeTreeRoot.expanded = true;
        $nodeTreeRoot.children = $nodeTreeRoot.children;
    });

</script>
<p>
    Node - {nodeInfo.trim().split('/')[1]}
    <br/>
    NodeGroup - {nodeInfo.trim().split('/')[0]}
</p>