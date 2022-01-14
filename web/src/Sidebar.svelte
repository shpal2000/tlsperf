<script>

    import TrafficProfiles from "./TrafficProfiles.svelte";
    import TrafficNodes from "./TrafficNodes.svelte";
</script>

<div class="sidebar">

    <TrafficNodes />

    <TrafficProfiles />

</div>

<style>

    .sidebar {
        height: calc(100vh - 3.25rem);
        border-right: 1px solid lightgrey;
        overflow: scroll;
    }

</style>