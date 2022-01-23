<script>
    import { selectedNode } from './store.js';
    import { nodeTreeRoot } from './store.js';
    import { ProgressBar } from "carbon-components-svelte";


    export let isActive;

    let Name;
    let nameError;
    let nameHelp;

    let SshIP;
    let sshIPError;
    let sshIPHelp;

    let SshUser;
    let sshUserError;
    let sshUserHelp;

    let SshPass;
    let sshPassError;
    let sshPassHelp;

    let isError;
    let errorMsg;
    let errorRows;
    let isProgress;

    let controller = null;
    let signal = null;

    function resetState() {
      Name = '';
      nameError = false;

      SshIP = '';
      sshIPError = false;

      SshUser = '';
      sshUserError = false;

      SshPass = '';
      sshPassError = false;
      
      isError = false;
      isProgress = false;

      isActive=false;
    }

    resetState();    

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher ();


    function validateName () {
      let nameRegex = new RegExp('^[a-z0-9]+$', 'i');
      let nodeGroup = $nodeTreeRoot.children.find (ng => $selectedNode.Name==ng.Name);

      if (Name.trim() == ''){
        nameHelp = 'required';
        nameError = true;
      } else if (!nameRegex.test(Name)){
        nameHelp = 'invalid - alphanumeric only';
        nameError = true;
      } else if (nodeGroup.children.find (n => n.Name==Name)){
        nameHelp = 'already exist';
        nameError = true; 
      } else {
        nameError = false;
      }
    }

    function validateSshIP () {
      let sshIPRegex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', );

      if (SshIP.trim() == ''){
        sshIPHelp = 'required';
        sshIPError = true;
      } else if (!sshIPRegex.test(SshIP)){
        sshIPHelp = 'invalid - IP';
        sshIPError = true;
      } else {
        sshIPError = false;
      }
    }

    function validateSshUser () {
      let sshUserRegex = new RegExp('^[a-z0-9\-_\.]+$', 'i');

      if (SshUser.trim() == ''){
        sshUserHelp = 'required';
        sshUserError = true;
      } else if (!sshUserRegex.test(SshUser)){
        sshUserHelp = 'invalid - user name';
        sshUserError = true;
      } else {
        sshUserError = false;
      }
    }    

    function validateSshPass () {

      if (SshPass.trim() == ''){
        sshPassHelp = 'required';
        sshPassError = true;
      }else {
        sshPassError = false;
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

    async function onAddNodeOk () {

      validateName ();
      validateSshIP ();
      validateSshUser ();
      validateSshPass ();

      controller = new AbortController();
      signal = controller.signal;


      if (!nameError && !sshIPError && !sshUserError && !sshPassError) {
        try {
          errorMsg = '';
          isError = false;
          isProgress = true;
          const res = await fetch ('/api/nodes', {
            signal,
            method: 'POST',
            body: JSON.stringify({
              Name,
              SshIP,
              SshUser,
              SshPass,
              Group : $selectedNode.Name
            })
          });
          isProgress = false;

          if (res.ok) {

            const text = await res.text();
            let isJson = true;
            try {
              JSON.parse (text);
            } catch (e) {
              isJson = false;
            }
            
            if (isJson) {
              if (json.status == 0){
                dispatch ('addNodeSuccess', {Name: Name});
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
    <div class="modal-card box">
      <header>
        <p class="modal-card-title">Add Node</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Alias</label>
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

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Ssh IP</label>
          <div class="control">
            <input class="input {sshIPError ? 'is-danger' : 'is-info' }" 
              type="text" 
              placeholder="" 
              bind:value={SshIP}
              on:input={validateSshIP}
              >
            {#if sshIPError}
              <p class="help">{sshIPHelp}</p>
            {/if}
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Ssh User</label>
          <div class="control">
            <input class="input {sshUserError ? 'is-danger' : 'is-info' }" 
              type="text" 
              placeholder="" 
              bind:value={SshUser}
              on:input={validateSshUser}
              >
            {#if sshUserError}
              <p class="help">{sshUserHelp}</p>
            {/if}
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Ssh Pass</label>
          <div class="control">
            <input class="input {sshPassError ? 'is-danger' : 'is-info' }" 
              type="password" 
              placeholder=""
              bind:value={SshPass}
              on:input={validateSshPass}
              >
            {#if sshPassError}
              <p class="help">{sshPassHelp}</p>
            {/if}
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-info" on:click={onAddNodeOk}>Add</button>
          </div>
          <div class="control">
            <button class="button is-info is-light" on:click={onAddNodeCancel}>Cancel</button>
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