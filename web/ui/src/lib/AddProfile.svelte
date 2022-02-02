<script>
    import { selectedNode } from '$lib/store.js';
    import { profileTreeRoot } from '$lib/store.js';
    import { ProgressBar } from "carbon-components-svelte";

    export let isActive;

    let Name;
    let nameError;
    let nameHelp;

    let isError;
    let errorMsg;
    let errorRows;
    let isProgress;

    let controller = null;
    let signal = null;

    function resetState() {
      Name = '';
      nameError = false;
      
      isError = false;
      isProgress = false;

      isActive=false;
    }

    resetState();   

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher ();


    function validateName () {
      let nameRegex = new RegExp('^[a-z0-9]+$', 'i');
      let profileGroup = $profileTreeRoot.children.find (pg => $selectedNode.Name==pg.Name);

      if (Name.trim() == ''){
        nameHelp = 'required';
        nameError = true;
      } else if (!nameRegex.test(Name)){
        nameHelp = 'invalid - alphanumeric only';
        nameError = true;
      } else if (profileGroup.children.find (n => n.Name==Name)){
        nameHelp = 'already exist';
        nameError = true; 
      } else {
        nameError = false;
      }
    }

    function setErrorMsg(msg) {
      let lineRegex = new RegExp('\r?\n');

        errorMsg = msg;
        errorRows = (errorMsg.split(lineRegex)).length;
        if (errorRows == 0){
          errorRows = 1
        } else if (errorRows > 4){
          errorRows = 4;
        }
        isError = true;
    }

    async function onAddNodeCancel () {
      resetState ();

      if (controller) {
        controller.abort ();
      }
    }

    async function onAddProfileOk () {

      validateName ();

      if (!nameError) {
        controller = new AbortController();
        signal = controller.signal;

        try {
          errorMsg = '';
          isError = false;
          isProgress = true;
          const res = await fetch ('/api/profiles.json', {
            signal,
            method: 'POST',
            body: JSON.stringify({
              Name,
              Type : 'TlsClientServer',
              Group : $selectedNode.Name
            })
          });
          isProgress = false;

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
              if (json.status == 0){
                dispatch ('addProfileSuccess', {Name: Name});
                resetState();
              } else {
                console.log(json);
                setErrorMsg (json.message);
              }
            } else {
              isProgress = false;
              setErrorMsg (text); 
            }
          } else {
            console.log(res);
            setErrorMsg (JSON.stringify(res));
          }
        } catch (e) {
          isProgress = false;
          setErrorMsg (e.toString()); 
        }

      }
    }

</script>

<div class="modal {isActive ? 'is-active' : ''}">
    <div class="modal-background"></div>
    <div class="modal-card box ">
      <header>
        <p class="modal-card-title ">New Profile</p>
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline is-mobile">
          <div class="column is-half">
            <div class="field">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="label ">Name</label>
              <div class="control">
                <input class="input {nameError ? 'is-danger' : 'is-info' }"
                type="text"
                placeholder=""
                bind:value={Name}
                on:input={validateName}
                >
                {#if nameError}
                  <p class="help">{nameHelp}</p>
                {/if}
              </div>
            </div>
          </div>

          <div class="column is-half">
            <div class="field">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="label ">Type</label>
              <div class="select is-fullwidth ">
                <select class="">
                  <option>TlsClientServer</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button  is-info" on:click={onAddProfileOk}>Add</button>
          </div>
          <div class="control">
            <button class="button  is-light" on:click={onAddNodeCancel}>Cancel</button>
          </div>
        </div>

        {#if isProgress}
          <div class="field">
            <div class="control">
              <ProgressBar helperText=""/>
            </div>
          </div>
        {/if}

        {#if isError}
          <div class="field">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="label">Error</label>
            <div class="control">
              <textarea class="textarea errmsg" placeholder="" rows="{errorRows}" value={errorMsg} readonly/>
            </div>
          </div>          
        {/if}

      </section>
    </div>
</div>

<style>
  .errmsg {
    background-color: transparent;
    color: red;
    overflow: auto;
  }
</style>