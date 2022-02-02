<p>stats</p>

<script>
    import { page } from '$app/stores'

    let Profile = $page.stuff.Profile;

</script>

<p>Profile / stats : {Profile.Group} - {Profile.Name}</p>
<p>{JSON.stringify(Profile)}</p>