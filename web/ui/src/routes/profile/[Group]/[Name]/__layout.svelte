<script context="module">

    export async function load ( {params, fetch, session, stuff, url} ) {
        const group = params.Group;
        const name = params.Name;

        try {
            const res = await fetch (`/api/profile.json?group=${group}&name=${name}`);
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
                            },
                            stuff: {
                                Profile: json.data
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
    import { profileTreeRoot } from '$lib/store.js';
    import { selectedNode } from '$lib/store.js';
    import { page } from '$app/stores';
    import {goto} from "$app/navigation";

    export let Group;
    export let Name;

    let activeTab = 'Config';

    function onConfigClick(e) {
        goto('/profile/'+Group+'/'+Name)
        activeTab = 'Config';
    }

    function onStatsClick(e) {
        goto('/profile/'+Group+'/'+Name+'/stats');
        activeTab = 'Stats';
    }


    onMount ( () => {
        $profileTreeRoot.expanded = true;

        let nodeGroup = $profileTreeRoot.children.find (pg => pg.Name==Group);

        if (nodeGroup) {
            nodeGroup.expanded = true;
        }

        $selectedNode.Name = Name;
        $selectedNode.ParentName = Group;
        $selectedNode.Type = 'Profile';
    });

</script>

<!-- <p>Profile : {Group} - {Name}</p>
<p>{JSON.stringify($page.stuff.Profile)}</p> -->

<nav class="breadcrumb is-left breadcrumb-margin" aria-label="breadcrumbs">
    <ul>
        <!-- svelte-ignore a11y-missing-attribute -->
        <li class="is-active" ><a>Profiles</a></li>

        <!-- svelte-ignore a11y-missing-attribute -->
        <li class="is-active" ><a>{Group}</a></li>

        <!-- svelte-ignore a11y-missing-attribute -->
        <li class="is-active" ><a>{Name}</a></li>
    </ul>
</nav>

<style>
    .breadcrumb-margin {
        margin-top: 24px;
        margin-left: 1.1rem;
    }
</style>

<slot />
