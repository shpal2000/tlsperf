<script context="module">

    export async function load ( {params, fetch, session, stuff, url} ) {
        const group = params.Group;
        const name = params.Name;

        try {
            const res = await fetch (`/api/node.json?group=${group}&name=${name}`);
            if (res.ok) {
                const text = await res.text();
                let isJson = true;
                let json = {};
                try {
                    json = JSON.parse (text);
                } catch (e) {
                    isJson = false;
                }

                if (isJson) {
                    if (json.status == 0) {
                        return {
                            props: {
                                Group: json.data.Group,
                                Name: json.data.Name
                            }
                        }
                    } else {
                        return {status: 404, error: new Error(`Clound not load ${url} \n ${json.message}`)};
                    }
                } else {
                    return {status: 404, error: new Error(`Clound not load ${url} \n ${text}`)};
                }
            }
        } catch (e) {
            return {status: 404, error: new Error(`Clound not load ${url} \n ${e}`)};
        }

        return {status: 500, error: new Error(`Clound not load ${url}`)};
    }

</script>

<script>
    import { onMount } from "svelte";
    import { nodeTreeRoot } from '$lib/store.js';
    import { selectedNode } from '$lib/store.js';

    export let Group;
    export let Name;

    onMount ( () => {
        $nodeTreeRoot.expanded = true;

        let nodeGroup = $nodeTreeRoot.children.find (ng => ng.Name==Group);

        if (nodeGroup) {
            nodeGroup.expanded = true;
        }

        $selectedNode.Name = Name;
        $selectedNode.ParentName = Group;
        $selectedNode.Type = 'Node';

    });

</script>

<h1>Welcome to SvelteKit</h1>
<p>Node : {Group} - {Name}</p>
