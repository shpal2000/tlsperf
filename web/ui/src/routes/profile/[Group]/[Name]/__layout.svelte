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
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    import { profileTreeRoot } from '$lib/store.js';
    import { selectedNode } from '$lib/store.js';

    export let Profile;

    onMount ( () => {
        $profileTreeRoot.expanded = true;

        let nodeGroup = $profileTreeRoot.children.find (pg => pg.Name==Profile.Group);

        if (nodeGroup) {
            nodeGroup.expanded = true;
        }

        $selectedNode.Name = Profile.Name;
        $selectedNode.ParentName = Profile.Group;
        $selectedNode.Type = 'Profile';

        const StoredProfile = writable (Profile);

        setContext('Profile', StoredProfile)
    });

</script>

<p>Profile : {Profile.Group} - {Profile.Name}</p>
<p>{JSON.stringify(Profile)}</p>

<slot />
