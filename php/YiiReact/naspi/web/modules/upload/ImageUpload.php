<?php

namespace app\modules\upload;

class ImageUpload extends UploadHandler {

    public function get_path($file_name = null) {
        return '/';
    }

    protected function get_file_name($file_path, $name, $size, $type, $error,
                                     $index, $content_range) {
        $filename = $this->get_unique_id($name);
        return $this->get_unique_filename(
            $file_path,
            $filename,
            $size,
            $type,
            $error,
            $index,
            $content_range
        );
    }

    protected function get_unique_id($name) {
        $path_info = pathinfo($name);
        return uniqid() . "-" . uniqid() . "-" . uniqid() . "." . $path_info['extension'];
    }

}
