import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
	return (
      <div>
      	<p className=''>
      		{'This Magic Brain will detect faces in your pictures. Git it a '}
      	</p>
      <div className='center'>
	      <div className='form center pa4 br3 shadow-5'>
	      	<input className='f4 pcentera2 w-70 center' type="tex" onChange={onInputChange}/>
	      	<button className='w-30 grow f4 link ph3 ov2 dib white bg-light-purple' onClick={onButtonSubmit} >Detect</button>
	      </div>
      </div>
      </div>
	);
}

export default ImageLinkForm;