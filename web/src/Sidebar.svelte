<script>
    import Treenode from "./Treenode.svelte";
    export let data;
</script>

<div class="sidebar">
    <ul>
        <Treenode bind:node={data}/>
    </ul>
</div>


<style>

    .sidebar {
        height: 100vh;
        background-color: whitesmoke;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

</style>