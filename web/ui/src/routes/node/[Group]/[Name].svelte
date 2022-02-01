<script context="module">

    export async function load ( {params, fetch, session, stuff} ) {
        
        console.log ('here ' + params.Name + ' ' + params.Group);
        return {
            props: {
                nodeGroup: params.Group,
                nodeName:  params.Name
            }
        }
    }


</script>

<script>
    export let nodeGroup;
    export let nodeName;    
</script>

<h1>Welcome to SvelteKit</h1>
<p>Node : {nodeGroup} - {nodeName}</p>
