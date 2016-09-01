// import node modules
import React from 'react';
import { withRouter } from 'react-router';
import get from 'lodash.get';
import moment from 'moment';

import { deriveProjectId } from '../models/reducers';
import ProposalThumb from '../components/ProposalThumb.jsx';


class ProjectPage extends React.Component {

	constructor (props) {

		super(props);

	}

	componentWillMount () {

		this.props.actions.requestProject(this.props.params.owner, this.props.params.projectId);

	}

	render () {

		const storeState = this.props.store.getState(),
			project = storeState.projects[deriveProjectId(this.props.params.owner, this.props.params.projectId)];
		let proposals = get(project, 'proposals') || {};

		proposals = Object.keys(proposals)
			.map(k => proposals[k])
			.sort((a, b) => moment(a.updated_at) - moment(b.updated_at));	// most recently-updated first

		let body;
		if (!project || project.loading) {

			body = <div>Loading...</div>;

		} else {
			if (proposals.length) {

				body = (
					<ul>
						{ proposals.map(proposal => {
							return (
								<li key={ proposal.id }>
									<ProposalThumb
										project={ project.metadata }
										{ ...proposal }
									/>
								</li>
							);
						}) }
					</ul>
				);

			} else {

				body = <div>No proposals created yet.</div>;

			}
		}

		return (
			<div className='project-page page'>
				<h2 className='project-name'>{ get(project, 'metadata.name') || '' }</h2>
				<p className='project-desc'>{ get(project, 'metadata.description') || '' }</p>
				{ body }
			</div>
		);

	}

}

export default withRouter(ProjectPage);
