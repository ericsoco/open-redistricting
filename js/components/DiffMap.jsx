import React, { PropTypes } from 'react';

// JSTS doesn't bundle properly....why not?
// import jsts from 'jsts';

class DiffMap extends React.Component {

	constructor (props) {

		super(props);
		this.state = {};

	}

	static propTypes = {
		path1: PropTypes.string.isRequired,
		path2: PropTypes.string.isRequired,
		fetchJSON: PropTypes.func.isRequired
	}

	componentWillMount () {

		let jsts = require('jsts'),
			{ path1, path2 } = this.props;

		Promise.all([
			this.props.fetchJSON(path1),
			this.props.fetchJSON(path2)
		])
		.then(

			responses => {
				
				let reader = new jsts.io.GeoJSONReader(),
					p1 = reader.read(responses[0]),
					p2 = reader.read(responses[1]);

				try {

					p1 = p1.features.reduce((acc, f, i) => {
						if (i === 0) return f.geometry;
						if (acc.geometries) return acc.union(f.geometry);
						return acc.geometry.union(f.geometry);
					});

					p2 = p2.features.reduce((acc, f, i) => {
						if (i === 0) return f.geometry;
						if (acc.geometries) return acc.union(f.geometry);
						return acc.geometry.union(f.geometry);
					});

				} catch (error) {
					this.setState({
						diffError: `Could not parse GeoJSON from ${ path1 } and ${ path2 }`
					});
				}

				let diff = {
					type: 'Feature',
					properties: {},
					geometry: new jsts.io.GeoJSONWriter().write(p1.symDifference(p2))
				};
				this.setState({ diff });
			},

			error => {
				this.setState({
					diffError: `Could not fetch/read GeoJSON from ${ path1 } and ${ path2 }`
				});
			}

		);

	}

	render () {

		let body;
		if (this.state.diff) {
			console.log(">>>>> TODO: render diff:", this.state.diff);
			body = (
				<div className='diff'>
					TODO: render diff
				</div>
			);
		} else if (this.state.diffError) {
			body = (
				<div className='diff-error'>
					{ this.state.diffError }
				</div>
			);
		}

		return (
			<div className='diff-map'>
				{ body }
			</div>
		);

	}

}

export default DiffMap;