const axios = require('axios');
const https = require('https');

class portainer {
	/**
	 * @description provide an api_key or admin credientials. If using admin creds set api_key to null and supply user pass
	 * @param {string} host
	 * @param {number} port
	 * @param {boolean} usehttps
	 * @param {string} api_key
	 * @param {string} authUser
	 * @param {string} authPass
	 */
	constructor(host, port, usehttps, api_key, authUser, authPass) {
		if (api_key) {
			this.api_key = api_key
			this.authToken = 'X-API-Key'
		} else if (authUser && authPass) {
			this.authUser = authUser
			this.authPass = authPass
			this.authToken = 'Authorization'
		}
		this.protocol = usehttps ? 'https' : 'http'
		this.basePath = `${this.protocol}://${host}:${port}/api`;
		
	}

	async request(method, endpoint, reqData = '') {
		return new Promise(( resolve, reject ) => {
			const reqURL = this.basePath + endpoint;

			if (this.authToken === 'Authorization') {

			}

			const config = {
				url: reqURL,
				method: method,
				headers: {
					"X-API-Key": this.api_key,
					Accept: 'application/json',
				},
			}

			if (reqData != '') {
				config.data = reqData
			}

			if (this.protocol === 'https') {
				config.httpsAgent = new https.Agent({rejectUnauthorized: false})
			}

			axios(config)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
		});
	}

	// ===================
	// === Containers ====
	// ===================

	/**
	 * @description Returns a list of containers.
	 * @access -
	 * @param {integer} enviromentID
	 * @param {boolean} all
	 * @returns 
	 */
	container_getContainers(enviromentID, all = false) {
		var endpoint = `/endpoints/${enviromentID}/docker/containers/json`
		if (all) {
			endpoint += `?all=${all}`
		}
		return this.request('GET', endpoint)
	}

	/**
	 * @description Makes a container. See docker api docuentation for body formatting
	 * @access -
	 * @param {integer} enviromentID
	 * @param {string} name
	 * @param {object} body
	 */
	container_make(enviromentID, name = null, body) {
		var endpoint = `/endpoints/${enviromentID}/docker/containers/json`
		if (name) {
			endpoint += `?name=${name}`
		}
		return this.request('POST', endpoint, body)
	}

	/**
	 * @description Return low-level information about a container.
	 * @access -
	 * @param {integer} enviromentID
	 * @param {string} containerID
	 */
	container_inspect(enviromentID, containerID) {
		return this.request('GET', `/endpoints/${enviromentID}/docker/containers/${containerID}/json`)
	}

	/**
	 * @description List processes running inside a container. On Unix systems, this is done by running the ps command. This endpoint is not supported on Windows.
	 * @access -
	 * @param {integer} enviromentID
	 * @param {string} containerID
	 * @param {string} ps_args
	 */
	container_listProcesses(enviromentID, containerID, ps_args = '') {
		var endpoint = `/endpoints/${enviromentID}/docker/containers/${containerID}/top`
		if (ps_args) {
			endpoint += `?ps_args=${ps_args}`
		}
		return this.request('GET', endpoint)
	}

	/**
	 * @description Get stdout and stderr logs from a container. Note: This endpoint works only for containers with the json-file or journald logging driver.
	 * @access -
	 * @param {integer} enviromentID
	 * @param {string} containerID
	 * @param {boolean} [follow=false] - Keep connection after returning logs.
	 * @param {boolean} [stdout=false] - Return logs from stdout
	 * @param {boolean} [stderr=false] - Return logs from stderr
	 * @param {integer} [since=0] - Only return logs since this time, as a UNIX timestamp
	 * @param {integer} [until=0] - Only return logs before this time, as a UNIX timestamp
	 * @param {boolean} [timestamps=false] - Add timestamps to every log line
	 * @param {"integer" | "string"} [tail=all] - Only return this number of log lines from the end of the logs. Specify as an integer or all to output all log lines.
	 */
	container_getLogs(enviromentID, containerID, follow, stdout, stderr, since, until, timestamps, tail) {
		var endpoint = `/endpoints/${enviromentID}/docker/containers/${containerID}/logs`
		if (follow) endpoint += `?follow=${follow}`
		if (stdout) endpoint += `?stdout=${stdout}`
		if (stderr) endpoint += `?stderr=${stderr}`
		if (since) endpoint += `?since=${since}`
		if (until) endpoint += `?until=${until}`
		if (timestamps) endpoint += `?timestamps=${timestamps}`
		if (tail) endpoint += `?tail=${tail}`
		return this.request('GET', endpoint)
	}

	/**
	 * @description Returns which files in a container's filesystem have been added, deleted, or modified. The Kind of modification can be one of: 0: Modified ("C") 1: Added ("A") 2: Deleted ("D")
	 * @access -
	 * @param {integer} enviromentID
	 * @param {string} containerID
	 */
	container_getFilesystemChanges(enviromentID, containerID) {
		return this.request('GET', `/endpoints/${enviromentID}/docker/containers/${containerID}/changes`)
	}
	
	// /**
	//  * @description Export the contents of a container as a tarball.
	//  * @access -
	//  * @param {integer} enviromentID
	//  * @param {string} containerID
	//  */
	// container_export(enviromentID, containerID) {
	// 	return this.request('GET', `/endpoints/${enviromentID}/docker/containers/${containerID}/export`)
	// }

	/**
	 * @description Get stdout and stderr logs from a container. Note: This endpoint works only for containers with the json-file or journald logging driver.
	 * @access -
	 * @param {integer} enviromentID
	 * @param {string} containerID
	 * @param {boolean} [stream=false] - Stream the output. If false, the stats will be output once and then it will disconnect.
	 * @param {boolean} [one_shot=false] - Only get a single stat instead of waiting for 2 cycles. Must be used with stream=false.
	 */
	container_getStats(enviromentID, containerID, stream, one_shot) {
		var endpoint = `/endpoints/${enviromentID}/docker/containers/${containerID}/stats`
		if (stream) {endpoint += `?stream=${stream}`} else {endpoint += '?stream=false'}
		if (one_shot) endpoint += `?one-shot=${one_shot}`
		return this.request('GET', endpoint)
	}

	/**
	 * @description Get stdout and stderr logs from a container. Note: This endpoint works only for containers with the json-file or journald logging driver.
	 * @access -
	 * @param {integer} enviromentID
	 * @param {string} containerID
	 * @param {boolean} [stream=false] - Stream the output. If false, the stats will be output once and then it will disconnect.
	 * @param {boolean} [one_shot=false] - Only get a single stat instead of waiting for 2 cycles. Must be used with stream=false.
	 */
	container_getStats(enviromentID, containerID, stream, one_shot) {
		var endpoint = `/endpoints/${enviromentID}/docker/containers/${containerID}/stats`
		if (stream) {endpoint += `?stream=${stream}`} else {endpoint += '?stream=false'}
		if (one_shot) endpoint += `?one-shot=${one_shot}`
		return this.request('GET', endpoint)
	}

















	// ===============================
	// === Enviroments(Endpoints) ====
	// ===============================

	// /**
	//  * @param {number} [start] - Start searching from
	//  * @param {number} [limit] - Limit results to this value
	//  * @param {'Name'|'Group'|'Status'|'LastCheckIn'|'EdgeID'} [sort] - Sort results by this value
	//  * @param {number} [order] - Sort order
	//  * @param {string} [search] - Search term
	//  * @param {number[]} [groupIds] - Group IDs
	//  * @param {number[]} [status] - List environments(endpoints) by this status
	//  * @param {number[]} [types] - List environments(endpoints) of this type
	//  * @param {number[]} [tagIds] - search environments(endpoints) with these tags (depends on tagsPartialMatch)
	//  * @param {boolean} [tagsPartialMatch] - If true, will return environment(endpoint) which has one of tagIds, if false (or missing) will return only environments(endpoints) that has all the tags
	//  * @param {number[]} [endpointIds] - will return only these environments(endpoints)
	//  * @param {number[]} [excludeIds] - will exclude these environments(endpoints)
	//  * @param {boolean} [provisioned] - If true, will return environment(endpoint) that were provisioned
	//  * @param {number[]} [agentVersions] - will return only environments with on of these agent versions
	//  * @param {boolean} [edgeAsync] - if exists true show only edge async agents, false show only standard edge agents. if missing, will show both types (relevant only for edge agents)
	//  * @param {boolean} [edgeDeviceUntrusted] - if true, show only untrusted edge agents, if false show only trusted edge agents (relevant only for edge agents)
	//  * @param {number} [edgeCheckInPassedSeconds] - if bigger then zero, show only edge agents that checked-in in the last provided seconds (relevant only for edge agents)
	//  * @param {boolean} [excludeSnapshots] - if true, the snapshot data won't be retrieved
	//  * @param {string} [name] - will return only environments(endpoints) with this name
	//  * @param {string} [edgeStackStatus] - only applied when edgeStackId exists. Filter the returned environments based on their deployment status in the stack (not the environment status!)
	//  * @param {number[]} [edgeGroupIds] - List environments(endpoints) of these edge groups
	//  * @param {number[]} [excludeEdgeGroupIds] - Exclude environments(endpoints) of these edge groups
	//  */
	// getEnviroments(start, limit, sort, order, search, groupIds, status, types, tagIds, tagsPartialMatch, endpointIds, excludeIds, provisioned, agentVersions, edgeAsync, edgeDeviceUntrusted, edgeCheckInPassedSeconds, excludeSnapshots, name, edgeStackStatus, edgeGroupIds, excludeEdgeGroupIds) {
	// 	return this.request('GET', '/endpoints');
	// }

	/**
	 * @description List all environments(endpoints) based on the current user authorizations. Will return all environments(endpoints) if using an administrator or team leader account otherwise it will only return authorized environments(endpoints).
	 * @access restricted
	 */
	enviroment_getEnviroments() {
		return this.request('GET', '/endpoints');
	}

	/**
	 * @description Create a new environment(endpoint)
	 * @access administrator
	 * @param {string} name -- Name that will be used to identify it
	 * @param {integer} EndpointCreationType -- Value must be one of: 1 (Local Docker environment), 2 (Agent environment), 3 (Azure environment), 4 (Edge agent environment) or 5 (Local Kubernetes Environment)
	 * @param {string} EdgeTunnelServerAddress -- URL or IP address that will be used to establish a reverse tunnel. (Ex: unix:///var/run/docker.sock)
	 */
	enviroment_make(Name, EndpointCreationType, EdgeTunnelServerAddress) {
		return this.request('POST', `/endpoints?Name=${Name}?EndpointCreationType=${EndpointCreationType}?EdgeTunnelServerAddress=${EdgeTunnelServerAddress}`);
	}

	/**
	 * @description Remove the environment associated to the specified identifier
	 * @access Administrator only
	 * @param {integer} enviromentID
	 */
	enviroment_delete(enviromentID) {
		return this.request('DELETE', `/endpoints/${enviromentID}?id=${enviromentID}`);
	}

	/**
	 * @description Retrieve details about an environment(endpoint).
	 * @access restricted
	 * @param {integer} enviromentID
	 */
	enviroment_inspect(enviromentID) {
		return this.request('GET', `/endpoints/${enviromentID}?id=${enviromentID}`);
	}

	/**
	 * @description Update an environment(endpoint).
	 * @access authenticated
	 * @param {integer} enviromentID
	 * @param {object} body
	 */
	enviroment_update(enviromentID, body) {
		return this.request('PUT', `/endpoints/${enviromentID}?id=${enviromentID}?body=${body}`);
	}

	/**
	 * @description De-association an edge environment(endpoint).
	 * @access administrator
	 * @param {integer} enviromentID
	 */
	enviroment_deassociate(enviromentID) {
		return this.request('PUT', `/endpoints/${enviromentID}/association?id=${enviromentID}`);
	}

	// /**
	//  * @description Use this environment(endpoint) to upload TLS files.
	//  * @access administrator
	//  * @param {integer} enviromentID
	//  * @param {integer} Path
	//  * @param {file} file
	//  */
	// enviroment_uploadTLSFile(enviromentID, Path , file) {
	// 	return this.request('POST', `/endpoints/${enviromentID}/docker/v2/browse/put?id=${enviromentID}?path=${path}?file=${file}`);
	// }

	/**
	 * @description get docker pull limits for a docker hub registry in the environment
	 * @access ??
	 * @param {integer} enviromentID
	 * @param {integer} registryId
	 */
	enviroment_getDockerHubRegistryPullLimits(enviromentID, registryId) {
		return this.request('GET', `/endpoints/${enviromentID}/dockerhub/${registryId}?id=${enviromentID}?registryId=${registryId}`);
	}

	/**
	 * @description -
	 * @access public
	 * @param {integer} enviromentID
	 * @param {integer} jobID
	 */
	enviroment_inspectEdgeJobLog(enviromentID, jobID) {
		return this.request('POST', `/endpoints/${enviromentID}/edge/jobs/${jobID}/logs?id=${enviromentID}?jobID=${jobID}`)
	}

	/**
	 * @description -
	 * @access public
	 * @param {integer} enviromentID
	 * @param {integer} stackId
	 */
	enviroment_inspectEdgeStack(enviromentID, stackId) {
		return this.request('GET', `/endpoints/${enviromentID}/edge/stacks/${stackId}?id=${enviromentID}?jobID=${jobID}`)
	}

	/**
	 * @description environment(endpoint) for edge agent to check status of environment(endpoint)
	 * @access restricted only to Edge environments(endpoints)
	 * @param {integer} enviromentID
	 * @param {integer} stackId
	 */
	enviroment_getEdgeStatus(enviromentID) {
		return this.request('GET', `/endpoints/${enviromentID}/edge/status?id=${enviromentID}`)
	}

	/**
	 * @description force update a docker service
	 * @access authenticated
	 * @param {integer} enviromentID
	 * @param {object} body - Ex: { "pullImage": true, "serviceID": "string" }
	 */
	enviroment_forceUpdateDockerService(enviromentID, body) {
		return this.request('PUT', `/endpoints/${enviromentID}/forceupdateservice?id=${enviromentID}?body=${body}`)
	}

	/**
	 * @description List all registries based on the current user authorizations in current environment.
	 * @access authenticated
	 * @param {integer} enviromentID
	 * @param {string} namespace
	 */
	enviroment_getRegistries(enviromentID, namespace) {
		var endpoint = `/endpoints/${enviromentID}/registries`
		if (namespace) {
			endpoint += `?namespace=${namespace}`
		}
		return this.request('GET', endpoint + `?id=${enviromentID}`)
	}

	/**
	 * @description -
	 * @access authenticated
	 * @param {integer} enviromentID
	 * @param {integer} registryId
	 * @param {object} body
	 */
	enviroment_updateRegistry(enviromentID, registryId, body) {
		return this.request('PUT', `/endpoints/${enviromentID}/registries/${registryId}?id=${enviromentID}?registryId=${registryId}?body=${body}`)
	}

	/**
	 * @description Update settings for an environment(endpoint).
	 * @access authenticated
	 * @param {integer} enviromentID
	 * @param {object} body - Ex: { "pullImage": true, "serviceID": "string" }
	 */
	enviroment_updateSettings(enviromentID, body) {
		return this.request('PUT', `/endpoints/${enviromentID}/settings?id=${enviromentID}?body=${body}`)
	}

	/**
	 * @description Snapshots an environment(endpoint)
	 * @access administrator
	 * @param {integer} enviromentID
	 */
	enviroment_makeSnapshot(enviromentID) {
		return this.request('POST', `/endpoints/${enviromentID}/settings?id=${enviromentID}`)
	}

	/**
	 * @description Remove multiple environments and optionally clean-up associated resources.
	 * @access Administrator only
	 * @param {object} body - Ex: { "endpoints": [{ "deleteCluster": true, "id": 0 },{ "deleteCluster": false, "id": 1 }]}
	 */
	enviroment_deleteEnviroments(body) {
		return this.request('POST', `/endpoints/delete?body=${body}`)
	}

	/**
	 * @description -
	 * @access -
	 */
	enviroment_createOrRetrieveEdgeID() {
		return this.request('POST', `/endpoints/global-key`)
	}

	/**
	 * @description Update relations for a list of environments. Edge groups, tags and environment group can be updated.
	 * @access administrator
	 * @param {object} body
	 */
	enviroment_updateRelations(body) {
		return this.request('PUT', `/endpoints/delete?body=${body}`)
	}

	/**
	 * @description Snapshot ALL environments(endpoints)
	 * @access administrator
	 * @param {object} body
	 */
	enviroment_snapshotALLEnviroments() {
		return this.request('POST', `/endpoints/snapshot?body=${body}`)
	}










	// ===============
	// === stacks ====
	// ===============
	stack_getStacks() {
		return this.request('GET', '/stacks');
	}
	stack_start(stackID, endpointId) {
		return this.request('POST', `/stacks/${stackID}/start?id=${stackID}&endpointId=${endpointId}`);
	}
	stack_stop(stackID, endpointId) {
		return this.request('POST', `/stacks/${stackID}/stop?id=${stackID}&endpointId=${endpointId}`);
	}
}

module.exports = portainer;