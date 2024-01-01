def handler(event, context):
    l.info(event)
    try:
        i_token = hashlib.new(
            'md5', (event['RequestId'] + event['StackId']).encode()).hexdigest()
        props = event['ResourceProperties']

        if event['RequestType'] == 'Create':
            event['PhysicalResourceId'] = 'None'
            event['PhysicalResourceId'] = create_cert(props, i_token)
            add_tags(event['PhysicalResourceId'], props)
            validate(event['PhysicalResourceId'], props)

            if wait_for_issuance(event['PhysicalResourceId'], context):
                event['Status'] = 'SUCCESS'
                return send(event)
            else:
                return reinvoke(event, context)

        elif event['RequestType'] == 'Delete':
            if event['PhysicalResourceId'] != 'None':
                acm.delete_certificate(
                    CertificateArn=event['PhysicalResourceId'])
            event['Status'] = 'SUCCESS'
            return send(event)

        elif event['RequestType'] == 'Update':

            if replace_cert(event):
                event['PhysicalResourceId'] = create_cert(props, i_token)
                add_tags(event['PhysicalResourceId'], props)
                validate(event['PhysicalResourceId'], props)

                if not wait_for_issuance(event['PhysicalResourceId'], context):
                    return reinvoke(event, context)
            else:
                if 'Tags' in event['OldResourceProperties']:
                    acm.remove_tags_from_certificate(CertificateArn=event['PhysicalResourceId'],
                                                     Tags=event['OldResourceProperties']['Tags'])

                add_tags(event['PhysicalResourceId'], props)

            event['Status'] = 'SUCCESS'
            return send(event)
        else:
            raise RuntimeError('Unknown RequestType')

    except Exception as ex:
        l.exception('')
        event['Status'] = 'FAILED'
        event['Reason'] = str(ex)
        return send(event)
