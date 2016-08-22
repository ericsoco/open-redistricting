// import node modules
import React from 'react';
import { withRouter } from 'react-router';
import get from 'lodash.get';

import { deriveProjectId } from '../models/reducers';
import ProposalThumb from '../components/ProposalThumb.jsx';


class ProjectPage extends React.Component {

	constructor (props) {

		super(props);

	}

	componentWillMount () {

		// TODO: not sure we need this
		this.props.actions.requestProjectMetadata(this.props.params.owner, this.props.params.projectId);

		this.props.actions.requestProjectProposals(this.props.params.owner, this.props.params.projectId);

	}

	componentDidMount () {

		//

	}

	componentWillUnmount () {

		//

	}


	render () {

		const storeState = this.props.store.getState(),
			project = storeState.projects[deriveProjectId(this.props.params.owner, this.props.params.projectId)],
			proposals = get(project, 'proposals.data') || [];

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
										project={ project.data }
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
				<h2 className='project-name'>{ get(project, 'data.name') || '' }</h2>
				<p className='project-desc'>{ get(project, 'data.description') || '' }</p>
				{ body }
			</div>
		);

	}

}

export default withRouter(ProjectPage);
