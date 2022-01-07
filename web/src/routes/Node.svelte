<script>
    export let nodeName;
    import { onMount } from "svelte";
    import { selectedNode } from '../store.js';

    onMount ( () => {
        selectedNode.update(name => nodeName);
    });

</script>
<p>
    Node - {nodeName}
</p>