import React, { useState, useEffect } from 'react';
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import CustomButton from 'components/CustomButton';
// const icona = require('tui-image-editor/dist/svg/icon-a.svg');
// const iconb = require('tui-image-editor/dist/svg/icon-b.svg');
// const iconc = require('tui-image-editor/dist/svg/icon-c.svg');
// const icond = require('tui-image-editor/dist/svg/icon-d.svg');
function CustomImageEditor({
	file,
	index,
	buttonType,
	onUpdateImage,
	onCancel,
}) {
	let editorRef = React.createRef();
	const myTheme = {
		// Theme object to extends default dark theme.
		// "menu.backgroundColor": "white",
		// "common.backgroundColor": "#151515",
		// "downloadButton.backgroundColor": "white",
		// "downloadButton.borderColor": "white",
		// "downloadButton.color": "black",
		// "menu.normalIcon.path": icond,
		// "menu.activeIcon.path": iconb,
		// "menu.disabledIcon.path": icona,
		// "menu.hoverIcon.path": iconc,
	};
	const [attachment, setAttachment] = useState('');
	const onFileChange = (e) => {
		setAttachment(e.target.files[0]);
		const imageEditorInst = editorRef.current.imageEditorInst;
		imageEditorInst.loadImageFromFile(e.target.files[0], 'My sample image');
	};
	useEffect(() => {
		// console.log("index ", editorRef?.current?.imageEditorInst, file);
		setTimeout(() => {
			// console.log("Time Out");
			const imageEditorInst = editorRef?.current?.imageEditorInst;
      if(file?.name){

        imageEditorInst?.loadImageFromFile(file, file?.name);
      }else{

        console.log("imageEditorInst" , editorRef.current)
        imageEditorInst.loadImageFromURL(
          `${file}?t=${new Date().getTime()}`
        //   'https://d2908q01vomqb2.cloudfront.net/fc074d501302eb2b93e2554793fcaf50b3bf7291/2018/06/19/contact-arch-1.png'
        //   `https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/526px-Wikipedia-logo-v2.svg.png`
          , "SampleImage_").then(result=>{
          imageEditorInst.ui.resizeEditor({
              imageSize: {oldWidth: result.oldWidth, oldHeight: result.oldHeight, newWidth: result.newWidth, newHeight: result.newHeight},
          });
      }).catch(err=>{
          console.error("Something went wrong:", err);
      })
        // imageEditorInst.loadImageFromURL(file, 'lena')
      }
		}, 1000);
	}, [file]);

	const saveImageToDisk = () => {
		const imageEditorInst = editorRef.current.imageEditorInst;
		const data = imageEditorInst.toDataURL();
		if (data) {
			const mimeType = data.split(';')[0];
			const extension = data.split(';')[0].split('/')[1];
			// console.log(data, `image.${extension}`, mimeType);
			const newFile = DataURIToBlob(data);
			onUpdateImage(
				{
					newFile,
					name: file?.name,
				},
				buttonType === 'Next' ? index + 1 : index,
				buttonType,
				index,
				data
			);
		}
	};

	function DataURIToBlob(dataURI) {
		const splitDataURI = dataURI.split(',');
		const byteString =
			splitDataURI[0].indexOf('base64') >= 0
				? atob(splitDataURI[1])
				: decodeURI(splitDataURI[1]);
		const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

		const ia = new Uint8Array(byteString.length);
		for (let i = 0; i < byteString.length; i++)
			ia[i] = byteString.charCodeAt(i);

		return new Blob([ia], { type: mimeString });
	}
	return (
		<div>
			{/* <input type="file" onChange={onFileChange} /> */}
			{/* <input type="file" onChange={onFileChange} />
          <CanvasDraw
          imgSrc={attachment !== "" ?  URL.createObjectURL(attachment) :""}
          /> */}
			<div className='imageEditorButtonStyle'>
				{onCancel && (
					<CustomButton onClick={onCancel} style={{ marginRight: 10 }}>
						Cancel
					</CustomButton>
				)}
				<CustomButton onClick={saveImageToDisk}>{buttonType}</CustomButton>
			</div>
			{
				<ImageEditor
					ref={editorRef}
					includeUI={{
						loadImage: {
							path: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
							name: 'Blank',
            },

						// loadImageFromFile:{
						//   imgFile : file,
						//   imageName : file?.name
						// },

						theme: myTheme,
						menu: ['shape', 'draw', 'crop', 'text', 'icon'],
						initMenu: '',
						uiSize: {
							// width: "300px",
							height: '75vh',
						},
						menuBarPosition: 'bottom',
					}}
					cssMaxHeight={350}
					cssMaxWidth={1000}
					selectionStyle={{
						cornerSize: 20,
						rotatingPointOffset: 70,
					}}
					usageStatistics={false}
				/>
			}
		</div>
	);
}

export default CustomImageEditor;
